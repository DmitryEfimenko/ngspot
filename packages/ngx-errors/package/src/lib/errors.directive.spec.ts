/* eslint-disable no-empty */
import { Component, ErrorHandler, ViewChild } from '@angular/core';
import { fakeAsync, flush } from '@angular/core/testing';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  NgForm,
} from '@angular/forms';

import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import { provideNgxErrorsConfig } from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import {
  NoControlError,
  NgxError,
  ControlInstanceError,
  ControlNotFoundError,
} from './ngx-errors';

@Component({
  selector: 'ngs-test-host-with-reactive-forms',
  // Explicitly mark as non-standalone to satisfy Angular 20 TestBed checks
  standalone: false,
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

@Component({
  // Explicitly mark as non-standalone to satisfy Angular 20 TestBed checks
  standalone: false,
})
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
  providers: [provideNgxErrorsConfig()],
  detectChanges: false,
});

const createDirectiveWithTemplateDrivenForms = createDirectiveFactory({
  directive: ErrorsDirective,
  host: TestHostWithTemplateDrivenFormsComponent,
  imports: [FormsModule],
  providers: [provideNgxErrorsConfig()],
});

function setupWithReactiveForms(
  template: string,
  opts?: {
    stubErrors: boolean;
  },
) {
  const spectator = createDirectiveWithReactiveForms(template);

  const errorHandler = spectator.inject(ErrorHandler);
  // eslint-disable-next-line jasmine/no-unsafe-spy
  const handleErrorSpy = spyOn(errorHandler, 'handleError');
  opts?.stubErrors
    ? handleErrorSpy.and.stub()
    : handleErrorSpy.and.callThrough();

  spectator.detectChanges();

  return { spectator, handleErrorSpy };
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
function expectNgxError(
  error: NgxError,
  factoryExpectedToThrow: () => {
    handleErrorSpy: jasmine.Spy<(error: any) => void>;
    spectator: SpectatorDirective<any>;
  },
) {
  const { handleErrorSpy, spectator } = factoryExpectedToThrow();
  let thrown: any;
  try {
    spectator.detectChanges();
  } catch (e) {
    thrown = e;
  }
  try {
    spectator.tick();
  } catch (e) {
    thrown = thrown ?? e;
  }

  const expectedMsg = error.message.replace('NgxError: ', '');

  if (handleErrorSpy.calls.any()) {
    const call =
      handleErrorSpy.calls.mostRecent() || handleErrorSpy.calls.first();
    const received = call.args[0] as Error | undefined;
    const receivedMsg = received?.message ?? '';
    expect(receivedMsg).toContain(expectedMsg);
    return;
  }

  // Fallback: ensure thrown error matches expected
  const thrownMsg = (thrown?.message as string) ?? '';
  expect(thrownMsg).toContain(expectedMsg);
}

function expectNoError(
  factoryExpectedNotToThrow: () => {
    handleErrorSpy: jasmine.Spy<(error: any) => void>;
  },
) {
  const { handleErrorSpy } = factoryExpectedNotToThrow();
  expect(handleErrorSpy).not.toHaveBeenCalled();
}

describe(ErrorsDirective.name, () => {
  it('should throw if no control is provided', fakeAsync(() => {
    expectNgxError(new NoControlError(), () =>
      setupWithReactiveForms(`<div [ngxErrors]="undefined"></div>`, {
        stubErrors: true,
      }),
    );
  }));

  describe('GIVEN: with control', () => {
    it('GIVEN: control is an instance of FormControl, should not throw', () => {
      expectNoError(() =>
        setupWithReactiveForms(`<div [ngxErrors]="control"></div>`),
      );
    });

    it('GIVEN: control is NOT an instance of FormControl, should throw', fakeAsync(() => {
      expectNgxError(new ControlInstanceError(), () =>
        setupWithReactiveForms(`<div [ngxErrors]="{}"></div>`, {
          stubErrors: true,
        }),
      );
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
      expectedControl: AbstractControl,
    ) {
      const actualControl = spectator.directive.resolvedControl();

      expect(actualControl).toBe(expectedControl);

      flush();
    }

    it('GIVEN: control specified as string; control exists, should not throw', fakeAsync(() => {
      const { spectator } = setupWithReactiveForms(`
      <div [formGroup]="form">
        <div ngxErrors="firstName"></div>
      </div>
      `);

      spectator.tick();

      const fName = spectator.hostComponent.form.get(
        'firstName',
      ) as FormControl;
      expectControl(spectator, fName);
    }));

    it('GIVEN: control specified as string; control DOES NOT exist, should throw', fakeAsync(() => {
      const template = `
        <form [formGroup]="form">
          <div ngxErrors="mistake"></div>
        </form>
      `;
      expectNgxError(new ControlNotFoundError('mistake'), () =>
        setupWithReactiveForms(template, { stubErrors: true }),
      );
    }));

    it('GIVEN: formGroup with nested formGroupName, control should be the "street"', fakeAsync(() => {
      const { spectator } = setupWithReactiveForms(`
      <form [formGroup]="form">
        <div formGroupName="address">
          <div ngxErrors="street"></div>
        </div>
      </form>
      `);

      spectator.tick();

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

      spectator.tick();

      expectControl(spectator, spectator.hostComponent.street);
    }));
  });

  describe('GIVEN: with template-driven forms', () => {
    /**
     * This function must run in the fakeAsync context
     */
    function expectControl(
      spectator: SpectatorDirective<
        ErrorsDirective,
        TestHostWithTemplateDrivenFormsComponent
      >,
      expectedControl: AbstractControl,
    ) {
      const actualControl = spectator.directive.resolvedControl();

      expect(expectedControl).toBeDefined();
      expect(actualControl).toBe(expectedControl);
    }

    it('GIVEN: the use of ngModelGroup should not throw', fakeAsync(async () => {
      const { spectator } = await setupWithTemplateDrivenForms(`
      <form>
        <div ngModelGroup="address" #addressModelGroup="ngModelGroup">
          <div [ngxErrors]="addressModelGroup.control"></div>
        </div>
      </form>
      `);

      spectator.tick();

      expectControl(
        spectator,
        spectator.hostComponent.form.controls['address'],
      );
    }));
  });
});
