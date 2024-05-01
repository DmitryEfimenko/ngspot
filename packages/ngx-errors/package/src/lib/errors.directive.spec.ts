/* eslint-disable no-empty */
import { Component, ViewChild } from '@angular/core';
import { fakeAsync, flush, tick } from '@angular/core/testing';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  NgForm,
} from '@angular/forms';

import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import { first } from 'rxjs/operators';

import { ErrorsConfiguration } from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import {
  ControlNotFoundError,
  NoControlError,
  ControlInstanceError,
  NgxError,
} from './ngx-errors';

@Component({
  selector: 'ngs-test-host-with-reactive-forms',
})
class TestHostWithReactiveFormsComponent {
  street = new FormControl();
  control = new FormControl();
  form = new FormGroup({
    firstName: new FormControl(),
    address: new FormGroup({
      street: this.street,
    }),
  });
}

@Component({})
class TestHostWithTemplateDrivenFormsComponent {
  @ViewChild(NgForm)
  form: NgForm;

  model = {
    firstName: 'Dima',
    address: {
      street: '11 test st',
    },
  };
}

const createDirectiveWithReactiveForms = createDirectiveFactory({
  directive: ErrorsDirective,
  host: TestHostWithReactiveFormsComponent,
  imports: [ReactiveFormsModule],
  providers: [ErrorsConfiguration],
});

const createDirectiveWithTemplateDrivenForms = createDirectiveFactory({
  directive: ErrorsDirective,
  host: TestHostWithTemplateDrivenFormsComponent,
  imports: [FormsModule],
  providers: [ErrorsConfiguration],
});

function setupWithReactiveForms(template: string) {
  const spectator = createDirectiveWithReactiveForms(template);

  return { spectator };
}

async function setupWithTemplateDrivenForms(template: string) {
  const spectator = createDirectiveWithTemplateDrivenForms(template);

  await spectator.fixture.whenRenderingDone();
  spectator.detectChanges();

  return { spectator };
}

/**
 * This function must run in the fakeAsync context
 */
function expectNgxError(error: NgxError) {
  expect(() => {
    tick();
  }).toThrow(error);

  try {
    // flush the setTimeout inside of the ngAfterViewInit. We need to flush it the
    // try catch block because it might throw a NoControlError error, which is
    // an expected behavior in some cases
    flush();
  } catch (e) {}
}

describe(ErrorsDirective.name, () => {
  it('should throw if no control is provided', fakeAsync(() => {
    // setupWithReactiveForms(`<div [ngxErrors]="undefined"></div>`);
    // expectNgxError(new NoControlError());
    expect(() => {
      setupWithReactiveForms(`<div ngxErrors></div>`);
    }).toThrow(new NoControlError());
  }));

  describe('GIVEN: with control', () => {
    it('GIVEN: control is an instance of FormControl, should not throw', () => {
      const { spectator } = setupWithReactiveForms(
        `<div [ngxErrors]="control"></div>`
      );

      expect(spectator.directive.control$).toBeDefined();
    });

    it('GIVEN: control is NOT an instance of FormControl, should throw', fakeAsync(() => {
      // setupWithReactiveForms(`<div [ngxErrors]="{}"></div>`);
      // expectNgxError(new ControlInstanceError());

      expect(() => {
        setupWithReactiveForms(`<div [ngxErrors]="{}"></div>`);
      }).toThrow(new ControlInstanceError());
    }));
  });

  describe('GIVEN: with parent formGroup', () => {
    /**
     * This function must run in the fakeAsync context
     */
    function expectControl(
      spectator: SpectatorDirective<
        ErrorsDirective,
        TestHostWithReactiveFormsComponent
      >,
      expectedControl: AbstractControl
    ) {
      let actualControl: AbstractControl | undefined;

      spectator.directive.control$.pipe(first()).subscribe((control) => {
        actualControl = control;
      });

      expect(actualControl).toBe(expectedControl);

      flush();
    }

    it('GIVEN: control specified as string; control exists, should not throw', fakeAsync(() => {
      const { spectator } = setupWithReactiveForms(`
      <div [formGroup]="form">
        <div ngxErrors="firstName"></div>
      </div>
      `);

      const fName = spectator.hostComponent.form.get(
        'firstName'
      ) as FormControl;
      expectControl(spectator, fName);
    }));

    it('GIVEN: control specified as string; control DOES NOT exist, should throw', fakeAsync(() => {
      expect(() => {
        setupWithReactiveForms(`
        <form [formGroup]="form">
          <div ngxErrors="mistake"></div>
        </form>
        `);
      }).toThrow(new ControlNotFoundError('mistake'));
      // setupWithReactiveForms(`
      // <form [formGroup]="form">
      //   <div ngxErrors="mistake"></div>
      // </form>
      // `);

      // expectNgxError(new ControlNotFoundError('mistake'));
    }));

    it('GIVEN: formGroup with nested formGroupName, control should be the "street"', fakeAsync(() => {
      const { spectator } = setupWithReactiveForms(`
      <form [formGroup]="form">
        <div formGroupName="address">
          <div ngxErrors="street"></div>
        </div>
      </form>
      `);

      expectControl(spectator, spectator.hostComponent.street);
    }));

    it('GIVEN: formGroup with nested formGroup, control should be the "street"', fakeAsync(() => {
      const { spectator } = setupWithReactiveForms(`
      <form [formGroup]="form">
        <div [formGroup]="form.get('address')">
          <div ngxErrors="street"></div>
        </div>
      </form>
      `);

      expectControl(spectator, spectator.hostComponent.street);
    }));
  });

  xdescribe('GIVEN: with template-driven forms', () => {
    /**
     * This function must run in the fakeAsync context
     */
    function expectControl(
      spectator: SpectatorDirective<
        ErrorsDirective,
        TestHostWithTemplateDrivenFormsComponent
      >,
      expectedControl: AbstractControl
    ) {
      let actualControl: AbstractControl | undefined;

      spectator.directive.control$.pipe(first()).subscribe((control) => {
        actualControl = control;
      });

      expect(expectedControl).toBeDefined();
      expect(actualControl).toBe(expectedControl);
    }

    it('GIVEN: the use of ngModelGroup should not throw', async () => {
      const { spectator } = await setupWithTemplateDrivenForms(`
      <form>
        <div ngModelGroup="address" #addressModelGroup="ngModelGroup">
          <div [ngxErrors]="addressModelGroup.control"></div>
        </div>
      </form>
      `);

      expectControl(
        spectator,
        spectator.hostComponent.form.controls['address']
      );
    });
  });
});
