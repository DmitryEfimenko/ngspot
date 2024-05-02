/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Component,
  Input,
  Optional,
  Provider,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { fakeAsync, flush, waitForAsync } from '@angular/core/testing';
import {
  AbstractControl,
  AsyncValidatorFn,
  ControlContainer,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  NgModelGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import {
  ShowOnDirtyErrorStateMatcher,
  ShowOnSubmittedErrorStateMatcher,
  ShowOnTouchedAndDirtyErrorStateMatcher,
  ShowOnTouchedErrorStateMatcher,
} from './error-state-matchers';
import { ErrorStateMatchers } from './error-state-matchers.service';
import { ErrorDirective } from './error.directive';
import {
  ErrorsConfiguration,
  IErrorsConfiguration,
} from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { NgxErrorsFormDirective } from './form.directive';
import { NoParentNgxErrorsError, ValueMustBeStringError } from './ngx-errors';

const myAsyncValidator: AsyncValidatorFn = (c: AbstractControl) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (c.value !== '123') {
        resolve({ isNot123: true });
      } else {
        resolve(null);
      }
    }, 50);
  });
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent {
  @ViewChild(NgForm) ngForm: NgForm;

  validInitialVal = new FormControl('val', Validators.required);
  invalidInitialVal = new FormControl('', Validators.required);
  multipleErrors = new FormControl('123456', [
    Validators.minLength(10),
    Validators.maxLength(3),
  ]);

  form = new FormGroup({
    validInitialVal: new FormControl('val', Validators.required),
    invalidInitialVal: new FormControl(3, Validators.min(10)),
    withAsyncValidator: new FormControl('', {
      asyncValidators: myAsyncValidator,
    }),
    address: new FormGroup({
      street: new FormControl('', Validators.required),
    }),
  });

  addressModel = { street: '' };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  submit() {}
}

export const formViewProvider: Provider = {
  provide: ControlContainer,
  useFactory: _formViewProviderFactory,
  deps: [
    [new Optional(), NgForm],
    [new Optional(), NgModelGroup],
  ],
};

export function _formViewProviderFactory(
  ngForm: NgForm,
  ngModelGroup: NgModelGroup
) {
  return ngModelGroup || ngForm || null;
}

@Component({
  selector: 'ngs-test-child-address',
  template: `
    <input
      #street="ngModel"
      required
      name="street"
      [(ngModel)]="address.street"
    />
    <div [ngxErrors]="street.control">
      <div ngxError="required">Required</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [formViewProvider],
})
class TestChildComponent {
  @Input() address: { street: string };
}

describe(ErrorDirective.name, () => {
  const initialConfig: IErrorsConfiguration = {
    showErrorsWhenInput: 'touched',
  };

  const createDirective = createDirectiveFactory({
    directive: ErrorDirective,
    declarations: [ErrorsDirective, NgxErrorsFormDirective, TestChildComponent],
    imports: [ReactiveFormsModule, FormsModule],
    providers: [
      { provide: ErrorsConfiguration, useValue: initialConfig },
      ErrorStateMatchers,
      ShowOnTouchedErrorStateMatcher,
      ShowOnDirtyErrorStateMatcher,
      ShowOnTouchedAndDirtyErrorStateMatcher,
      ShowOnSubmittedErrorStateMatcher,
    ],
    host: TestHostComponent,
  });

  function setupDirectiveWithConfig(
    template: string,
    showWhen: string | undefined,
    showMaxErrors?: number
  ) {
    const config = new ErrorsConfiguration();
    if (showWhen) {
      config.showErrorsWhenInput = showWhen;
    }
    if (showMaxErrors !== undefined) {
      config.showMaxErrors = showMaxErrors;
    }
    const spectator = createDirective(template, {
      providers: [
        {
          provide: ErrorsConfiguration,
          useValue: config,
        },
      ],
    });

    return { spectator };
  }

  function expectErrorShouldBeVisible(
    spectator: SpectatorDirective<ErrorDirective, TestHostComponent>
  ) {
    expect(spectator.element).toBeVisible();
  }

  function expectErrorShouldBeHidden(
    spectator: SpectatorDirective<ErrorDirective, TestHostComponent>
  ) {
    expect(spectator.element).toBeHidden();
  }

  function testErrorVisibilityForConfigShowWhenStates(opts: {
    template: string;
    expectedVisibility: boolean;
    action?: (
      spectator: SpectatorDirective<ErrorDirective, TestHostComponent>
    ) => void;
    forConfigShowWhenStates: string[];
  }) {
    opts.forConfigShowWhenStates.forEach((givenShowWhen) => {
      describe(`GIVEN: config.showWhen: ${givenShowWhen}`, () => {
        const visibility = opts.expectedVisibility ? 'visible' : 'invisible';

        it(`error should be ${visibility}`, waitForAsync(() => {
          const { spectator } = setupDirectiveWithConfig(
            opts.template,
            givenShowWhen
          );

          spectator.fixture.whenStable().then(() => {
            if (opts.action) {
              opts.action(spectator);
            }

            wait(0).then(() => {
              if (opts.expectedVisibility) {
                expectErrorShouldBeVisible(spectator);
              } else {
                expectErrorShouldBeHidden(spectator);
              }
            });
          });
        }));
      });
    });
  }

  it('should throw if no parent ngxErrors is found', () => {
    expect(() => {
      createDirective(`<div ngxError="required">Required</div>`);
    }).toThrow(new NoParentNgxErrorsError());
  });

  it('should throw if errorName is not provided', () => {
    expect(() => {
      createDirective(`
        <div [ngxErrors]="invalidInitialVal">
          <div ngxError>Required</div>
        </div>`);
    }).toThrow(new ValueMustBeStringError());
  });

  describe('PROP: showWhen', () => {
    function testShowWhenAssignment(opts: {
      template: string;
      givenConfigShowWhen: string;
      expectedDirectiveShowWhen: string;
    }) {
      it(`GIVEN: config.showWhen = "${opts.givenConfigShowWhen}", directive.showWhen should be "${opts.expectedDirectiveShowWhen}"`, () => {
        const { spectator } = setupDirectiveWithConfig(
          opts.template,
          opts.givenConfigShowWhen
        );

        expect(opts.expectedDirectiveShowWhen).toBe(
          spectator.directive.showWhen
        );
      });
    }

    describe('GIVEN: There is a parent formGroup', () => {
      describe('GIVEN: there is no override at the directive level', () => {
        const template = `
            <div [formGroup]="form">
              <div [ngxErrors]="'invalidInitialVal'">
                <div ngxError="req"></div>
              </div>
            </div>`;

        testShowWhenAssignment({
          template,
          givenConfigShowWhen: 'touched',
          expectedDirectiveShowWhen: 'touched',
        });
        testShowWhenAssignment({
          template,
          givenConfigShowWhen: 'dirty',
          expectedDirectiveShowWhen: 'dirty',
        });
        testShowWhenAssignment({
          template,
          givenConfigShowWhen: 'touchedAndDirty',
          expectedDirectiveShowWhen: 'touchedAndDirty',
        });
        testShowWhenAssignment({
          template,
          givenConfigShowWhen: 'formIsSubmitted',
          expectedDirectiveShowWhen: 'formIsSubmitted',
        });
      });

      describe('GIVEN: there is an override at the ngxErrors level', () => {
        const template = `
          <form [formGroup]="form">
            <div ngxErrors="invalidInitialVal" showWhen="touched">
              <div ngxError="req"></div>
            </div>
          </form>`;

        testShowWhenAssignment({
          template,
          givenConfigShowWhen: 'formIsSubmitted',
          expectedDirectiveShowWhen: 'touched',
        });
      });

      describe('GIVEN: there is an override at the ngxError level', () => {
        const template = `
          <form [formGroup]="form">
            <div ngxErrors="invalidInitialVal">
              <div ngxError="req" showWhen="touched"></div>
            </div>
          </form>`;

        testShowWhenAssignment({
          template,
          givenConfigShowWhen: 'formIsSubmitted',
          expectedDirectiveShowWhen: 'touched',
        });
      });
    });

    describe('GIVEN: There is no parent formGroup', () => {
      const template = `
        <div [ngxErrors]="validInitialVal">
          <div ngxError="req"></div>
        </div>`;

      testShowWhenAssignment({
        template,
        givenConfigShowWhen: 'formIsSubmitted',
        expectedDirectiveShowWhen: 'touched',
      });
    });
  });

  describe('TEST: initial visibility', () => {
    type TestControlType =
      | 'validInitialVal'
      | 'invalidInitialVal'
      | 'withAsyncValidator';

    function templateForTestControl(testControl: TestControlType) {
      return `
      <form [formGroup]="form">
        <div ngxErrors="${testControl}">
          <div ngxError="req"></div>
        </div>
      </form>`;
    }

    describe('GIVEN: testControl is "validInitialVal"', () => {
      const template = templateForTestControl('validInitialVal');

      testErrorVisibilityForConfigShowWhenStates({
        template,
        expectedVisibility: false,
        forConfigShowWhenStates: [
          'dirty',
          'touched',
          'touchedAndDirty',
          'formIsSubmitted',
        ],
      });
    });

    describe('GIVEN: testControl is "invalidInitialVal"', () => {
      const template = templateForTestControl('invalidInitialVal');

      testErrorVisibilityForConfigShowWhenStates({
        template,
        expectedVisibility: false,
        forConfigShowWhenStates: [
          'dirty',
          'touched',
          'touchedAndDirty',
          'formIsSubmitted',
        ],
      });
    });

    describe('GIVEN: testControl is "withAsyncValidator"', () => {
      describe('initial', () => {
        const template = templateForTestControl('withAsyncValidator');

        testErrorVisibilityForConfigShowWhenStates({
          template,
          expectedVisibility: false,
          forConfigShowWhenStates: ['dirty'],
        });
      });

      describe('after async validator was done', () => {
        it('error should be visible.', waitForAsync(() => {
          const controlName = 'withAsyncValidator';

          const template = `
          <form [formGroup]="form">
            <div ngxErrors="${controlName}">
              <div ngxError="isNot123"></div>
            </div>
          </form>`;

          const { spectator } = setupDirectiveWithConfig(template, undefined);

          const c = spectator.hostComponent.form.get(controlName)!;
          c.markAsTouched();

          wait(150).then(() => {
            expect(spectator.element).toBeVisible();
          });
        }));
      });
    });
  });

  describe('TEST: limiting amount of visible ngxError', () => {
    it('GIVEN: showMaxErrors is 1, should display 1 error', async () => {
      const template = `
        <ng-container [ngxErrors]="multipleErrors">
          <div ngxError="minlength">minlength</div>
          <div ngxError="maxlength">maxlength</div>
        </ng-container>`;

      const { spectator } = setupDirectiveWithConfig(template, 'touched', 1);
      spectator.hostComponent.multipleErrors.markAsTouched();
      spectator.hostComponent.multipleErrors.markAsDirty();

      await spectator.fixture.whenStable();
      const errors = spectator.queryAll('[ngxerror]:not([hidden])');

      expect(errors.length).toBe(1);
    });
  });

  describe('TEST: submitting a form should display an error', () => {
    const template = `
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="number" formControlName="invalidInitialVal" />

        <div ngxErrors="invalidInitialVal">
          <div ngxError="min"></div>
        </div>

        <button type="submit"></button>
      </form>`;

    testErrorVisibilityForConfigShowWhenStates({
      template,
      action: (spectator) => spectator.click('button'),
      expectedVisibility: true,
      forConfigShowWhenStates: [
        'dirty',
        'touched',
        'touchedAndDirty',
        'formIsSubmitted',
      ],
    });
  });

  describe('TEST: submitting a form with nested formGroup should display an error', () => {
    const template = `
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="number" formControlName="invalidInitialVal" />

        <div [formGroup]="form.get('address')">
          <div ngxErrors="street">
            <div ngxError="required">Required</div>
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>`;

    testErrorVisibilityForConfigShowWhenStates({
      template,
      action: (spectator) => spectator.click('button'),
      expectedVisibility: true,
      forConfigShowWhenStates: [
        'dirty',
        'touched',
        'touchedAndDirty',
        'formIsSubmitted',
      ],
    });
  });

  describe('TEST: visibility of error when interacting with an input', () => {
    const template = `
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="text" formControlName="invalidInitialVal" />

        <div ngxErrors="invalidInitialVal">
          <div ngxError="min">min 10</div>
        </div>
      </form>`;

    describe('WHEN: touch an input', () => {
      testErrorVisibilityForConfigShowWhenStates({
        template,
        action: (spectator) => {
          spectator.focus('input');
          spectator.blur('input');
        },
        expectedVisibility: true,
        forConfigShowWhenStates: ['touched'],
      });

      testErrorVisibilityForConfigShowWhenStates({
        template,
        action: (spectator) => {
          spectator.focus('input');
          spectator.blur('input');
        },
        expectedVisibility: false,
        forConfigShowWhenStates: [
          'dirty',
          'touchedAndDirty',
          'formIsSubmitted',
        ],
      });
    });

    describe('WHEN: type in the input', () => {
      testErrorVisibilityForConfigShowWhenStates({
        template,
        action: (spectator) => spectator.typeInElement('5', 'input'),
        expectedVisibility: true,
        forConfigShowWhenStates: ['dirty'],
      });

      testErrorVisibilityForConfigShowWhenStates({
        template,
        action: (spectator) => spectator.typeInElement('5', 'input'),
        expectedVisibility: false,
        forConfigShowWhenStates: [
          'touched',
          'touchedAndDirty',
          'formIsSubmitted',
        ],
      });
    });

    describe('WHEN: type in the input and focus out (touch)', () => {
      testErrorVisibilityForConfigShowWhenStates({
        template,
        action: (spectator) => {
          spectator.typeInElement('5', 'input');
          spectator.blur('input');
        },
        expectedVisibility: true,
        forConfigShowWhenStates: ['dirty', 'touched', 'touchedAndDirty'],
      });

      testErrorVisibilityForConfigShowWhenStates({
        template,
        action: (spectator) => {
          spectator.typeInElement('5', 'input');
          spectator.blur('input');
        },
        expectedVisibility: false,
        forConfigShowWhenStates: ['formIsSubmitted'],
      });
    });
  });

  describe('TEST: getting error details', () => {
    // Number should be greater than {{minError.ctx.min}}. You've typed {{minError.ctx}}.
    const template = `
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="number" formControlName="invalidInitialVal" />

        <div ngxErrors="invalidInitialVal">
          <div ngxError="min" #min="ngxError">
            Number should be greater than {{min.err.min}}. You've typed {{min.err.actual}}.
          </div>
        </div>

        <div id="error-outside" *ngIf="min.err.min">min: {{min.err.min}}</div>

        <button type="submit"></button>
      </form>`;

    it('should access error details and can use them outside of ngxErrors', () => {
      const { spectator } = setupDirectiveWithConfig(template, undefined);
      spectator.click('button');

      expect(spectator.element).toContainText(
        "Number should be greater than 10. You've typed 3."
      );

      expect(spectator.query('#error-outside')).toContainText('min: 10');
    });

    it('should access new error details after a change', fakeAsync(() => {
      const { spectator } = setupDirectiveWithConfig(template, undefined);

      spectator.typeInElement('4', 'input');
      spectator.blur('input');

      spectator.tick(0);
      flush();

      expect(spectator.query('[ngxerror="min"]')).toContainText(
        "Number should be greater than 10. You've typed 4."
      );

      expect(spectator.query('#error-outside')).toContainText('min: 10');
    }));
  });

  describe('TEST: directive is inside of child OnPush component', () => {
    const template = `
      <form>
        <ngs-test-child-address [address]="addressModel"></ngs-test-child-address>

        <button type="submit">Submit</button>
      </form>`;

    testErrorVisibilityForConfigShowWhenStates({
      template,
      action: (spectator) => {
        spectator.hostComponent.ngForm.form.markAllAsTouched();
      },
      expectedVisibility: true,
      forConfigShowWhenStates: ['touched', 'formIsSubmitted'],
    });

    testErrorVisibilityForConfigShowWhenStates({
      template,
      action: (spectator) => {
        spectator.hostComponent.ngForm.form.markAllAsTouched();
      },
      expectedVisibility: false,
      forConfigShowWhenStates: ['dirty', 'touchedAndDirty'],
    });
  });
});

function wait(t: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}
