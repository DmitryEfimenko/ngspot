/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Component,
  Input,
  Optional,
  Provider,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { discardPeriodicTasks, fakeAsync, flush } from '@angular/core/testing';
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

import { AllErrorsStateService } from './all-errors-state.service';
import { ProvidedErrorStateMatcherKeys } from './error-state-matchers.service';
import { ErrorDirective } from './error.directive';
import {
  ErrorsConfiguration,
  provideNgxErrorsConfig,
} from './errors-configuration';
import { NGX_ERRORS_DECLARATIONS } from './errors-declarations';
import { ErrorsDirective } from './errors.directive';
import { NgxErrorsFormDirective } from './form.directive';

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
  // Explicitly mark as non-standalone to satisfy Angular 20 TestBed checks
  standalone: false,
})
class TestHostComponent {
  @ViewChild(NgForm, { static: true }) ngForm: NgForm;

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
  ngModelGroup: NgModelGroup,
) {
  return ngModelGroup || ngForm || null;
}

const VISIBLE_ERROR_TEXT_PREFIX = 'ERROR TEXT';

function errorText(text?: string) {
  return text
    ? `${VISIBLE_ERROR_TEXT_PREFIX}: ${text}`
    : VISIBLE_ERROR_TEXT_PREFIX;
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
      <div *ngxError="'required'">${errorText('Required')}</div>
    </div>
  `,
  standalone: true,
  imports: [FormsModule, ...NGX_ERRORS_DECLARATIONS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [formViewProvider],
})
class TestChildComponent {
  @Input() address: { street: string };
}

describe(ErrorDirective.name, () => {
  const createDirective = createDirectiveFactory({
    directive: ErrorDirective,
    imports: [
      ReactiveFormsModule,
      FormsModule,
      ErrorsDirective,
      NgxErrorsFormDirective,
      TestChildComponent,
    ],
    providers: [
      provideNgxErrorsConfig(),
      // ErrorStateMatchers,
      // ShowOnTouchedErrorStateMatcher,
      // ShowOnDirtyErrorStateMatcher,
      // ShowOnTouchedAndDirtyErrorStateMatcher,
      // ShowOnSubmittedErrorStateMatcher,
    ],
    host: TestHostComponent,
  });

  function setupDirectiveWithConfig(
    template: string,
    showWhen: string | undefined,
    showMaxErrors?: number,
  ) {
    const config: ErrorsConfiguration = {
      showErrorsWhenInput: 'touched',
      showMaxErrors: null,
    };

    if (showWhen) {
      config.showErrorsWhenInput = showWhen;
    }
    if (showMaxErrors !== undefined) {
      config.showMaxErrors = showMaxErrors;
    }
    const spectator = createDirective(template, {
      providers: [provideNgxErrorsConfig(config)],
    });

    return { spectator };
  }

  function expectErrorShouldBeVisible(
    spectator: SpectatorDirective<ErrorDirective, TestHostComponent>,
  ) {
    expect(spectator.element).toHaveText(VISIBLE_ERROR_TEXT_PREFIX);
  }

  function expectErrorShouldBeHidden(
    spectator: SpectatorDirective<ErrorDirective, TestHostComponent>,
  ) {
    expect(spectator.element).not.toHaveText(VISIBLE_ERROR_TEXT_PREFIX);
  }

  function testErrorVisibilityForConfigShowWhenStates(opts: {
    template: string;
    expectedVisibility: boolean;
    action?: (
      spectator: SpectatorDirective<ErrorDirective, TestHostComponent>,
    ) => void;
    forConfigShowWhenStates: string[];
  }) {
    opts.forConfigShowWhenStates.forEach((givenShowWhen) => {
      describe(`GIVEN: config.showWhen: ${givenShowWhen}`, () => {
        const visibility = opts.expectedVisibility ? 'visible' : 'hidden';

        it(`error should be ${visibility}`, fakeAsync(async () => {
          const { spectator } = setupDirectiveWithConfig(
            opts.template,
            givenShowWhen,
          );

          // needed to make sure that possible child component is rendered
          await spectator.fixture.whenRenderingDone();
          flush();
          spectator.detectChanges();

          if (opts.action) {
            opts.action(spectator);
            // First flush microtasks (register control), then timers (auditTime(0))
            flush();
            spectator.tick();
            // Flush any follow-up microtasks from RxJS asapScheduler and effects
            flush();
            spectator.detectChanges();
          }

          if (opts.expectedVisibility) {
            expectErrorShouldBeVisible(spectator);
          } else {
            expectErrorShouldBeHidden(spectator);
          }
          flush();
          discardPeriodicTasks();
        }));
      });
    });
  }

  it('should throw if no parent ngxErrors is found', () => {
    expect(() => {
      createDirective(
        `<div *ngxError="'required'">${errorText('Required')}</div>`,
      );
    }).toThrowMatching((err: Error) => {
      return err.message.includes(
        'NG0201: No provider found for `NgxErrorsBase`',
      );
    });
  });

  describe('PROP: showWhen', () => {
    function testErrorVisibilityForConfigAndAction(opts: {
      template: string;
      controlFn: (host: TestHostComponent) => AbstractControl;
      givenConfigShowWhen: string;
      actionNotTriggeringError: ProvidedErrorStateMatcherKeys;
      actionTriggeringError: ProvidedErrorStateMatcherKeys;
    }) {
      it(`GIVEN: config.showWhen = "${opts.givenConfigShowWhen}", directive.showWhen should be "${opts.actionTriggeringError}"`, fakeAsync(() => {
        const { spectator } = setupDirectiveWithConfig(
          opts.template,
          opts.givenConfigShowWhen,
        );

        const control = opts.controlFn(spectator.hostComponent);
        const errorsState = spectator.inject(AllErrorsStateService);

        const actions: Record<ProvidedErrorStateMatcherKeys, () => void> = {
          dirty: () => control.markAsDirty(),
          touched: () => control.markAsTouched(),
          touchedAndDirty: () => {
            control.markAsDirty();
            control.markAsTouched();
          },
          formIsSubmitted: () => {
            spectator.click('button');
          },
        };

        function expectShouldBeShownToBe(expected: boolean) {
          const errors = errorsState.getControlState(control)?.errors();
          if (!errors) {
            throw new Error('impossible case');
          }

          const key = Number(Object.keys(errors)[0]);
          const actualShouldBeShown = errors[key];

          expect(actualShouldBeShown).toBe(expected);
        }

        actions[opts.actionNotTriggeringError]();
        flush();
        spectator.tick();
        flush();
        spectator.detectChanges();

        expectShouldBeShownToBe(false);

        actions[opts.actionTriggeringError]();
        flush();
        spectator.tick();
        flush();
        spectator.detectChanges();

        expectShouldBeShownToBe(true);

        flush();
      }));
    }

    describe('GIVEN: There is a parent formGroup', () => {
      describe('GIVEN: there is no override at the directive level', () => {
        const template = `
            <form [formGroup]="form">
              <div ngxErrors="invalidInitialVal">
                <div *ngxError="'min'"></div>
              </div>
              <button type="submit"></button>
            </form>`;

        testErrorVisibilityForConfigAndAction({
          template,
          controlFn: (host) => host.form.controls.invalidInitialVal,
          givenConfigShowWhen: 'touched',
          actionNotTriggeringError: 'dirty',
          actionTriggeringError: 'touched',
        });
        testErrorVisibilityForConfigAndAction({
          template,
          controlFn: (host) => host.form.controls.invalidInitialVal,
          givenConfigShowWhen: 'dirty',
          actionNotTriggeringError: 'touched',
          actionTriggeringError: 'dirty',
        });
        testErrorVisibilityForConfigAndAction({
          template,
          controlFn: (host) => host.form.controls.invalidInitialVal,
          givenConfigShowWhen: 'touchedAndDirty',
          actionNotTriggeringError: 'touched',
          actionTriggeringError: 'touchedAndDirty',
        });
        testErrorVisibilityForConfigAndAction({
          template,
          controlFn: (host) => host.form.controls.invalidInitialVal,
          givenConfigShowWhen: 'formIsSubmitted',
          actionNotTriggeringError: 'dirty',
          actionTriggeringError: 'formIsSubmitted',
        });
      });

      describe('GIVEN: there is an override at the ngxErrors level', () => {
        const template = `
          <form [formGroup]="form">
            <div ngxErrors="invalidInitialVal" showWhen="touched">
              <div *ngxError="'min'">${errorText()}</div>
            </div>
            <button type="submit"></button>
          </form>`;

        testErrorVisibilityForConfigAndAction({
          template,
          controlFn: (host) => host.form.controls.invalidInitialVal,
          givenConfigShowWhen: 'formIsSubmitted',
          actionNotTriggeringError: 'dirty',
          actionTriggeringError: 'touched',
        });
      });

      describe('GIVEN: there is an override at the ngxError level', () => {
        const template = `
          <form [formGroup]="form">
            <div ngxErrors="invalidInitialVal">
              <div *ngxError="'min'; showWhen: 'touched'">${errorText()}</div>
            </div>
          </form>`;

        testErrorVisibilityForConfigAndAction({
          template,
          controlFn: (host) => host.form.controls.invalidInitialVal,
          givenConfigShowWhen: 'formIsSubmitted',
          actionNotTriggeringError: 'dirty',
          actionTriggeringError: 'touched',
        });
      });
    });

    describe('GIVEN: There is no parent formGroup', () => {
      const template = `
        <div [ngxErrors]="invalidInitialVal">
          <div *ngxError="'required'">${errorText()}</div>
        </div>`;

      testErrorVisibilityForConfigAndAction({
        template,
        controlFn: (host) => host.invalidInitialVal,
        givenConfigShowWhen: 'formIsSubmitted',
        actionNotTriggeringError: 'dirty',
        actionTriggeringError: 'touched',
      });
    });
  });

  describe('TEST: initial visibility', () => {
    type TestControlType =
      | 'validInitialVal'
      | 'invalidInitialVal'
      | 'withAsyncValidator';

    function errorNameForControl(control: TestControlType) {
      const map: Record<TestControlType, string> = {
        invalidInitialVal: 'min',
        validInitialVal: 'required',
        withAsyncValidator: 'isNot123',
      };
      return map[control];
    }

    function templateForTestControl(testControl: TestControlType) {
      const errorName = errorNameForControl(testControl);
      return `
      <form [formGroup]="form">
        <div ngxErrors="${testControl}">
          <div *ngxError="'${errorName}'">${errorText()}</div>
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
        it('error should be visible.', fakeAsync(() => {
          const controlName = 'withAsyncValidator';

          const template = `
          <form [formGroup]="form">
            <div ngxErrors="${controlName}">
              <div *ngxError="'isNot123'">${errorText()}</div>
            </div>
          </form>`;

          const { spectator } = setupDirectiveWithConfig(template, undefined);

          const c = spectator.hostComponent.form.get(controlName)!;
          c.markAsTouched();
          // async validator takes 50ms
          spectator.tick(50);
          flush();

          expect(spectator.element).toBeVisible();
        }));
      });
    });
  });

  describe('TEST: limiting amount of visible ngxError', () => {
    it('GIVEN: showMaxErrors is 1, should display 1 error', fakeAsync(() => {
      const template = `
        <ng-container [ngxErrors]="multipleErrors">
          <div *ngxError="'minlength'" data-error="minlength"></div>
          <div *ngxError="'maxlength'" data-error="maxlength"></div>
        </ng-container>`;

      const { spectator } = setupDirectiveWithConfig(template, 'touched', 1);
      spectator.hostComponent.multipleErrors.markAsTouched();
      // Let ngxErrors register control and effects run
      flush();
      spectator.tick(0);
      flush();
      spectator.detectChanges();
      flush();

      const errors = spectator.queryAll('[data-error]');

      expect(errors.length).toBe(1);
    }));
  });

  describe('TEST: submitting a form should display an error', () => {
    const template = `
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="number" formControlName="invalidInitialVal" />

        <div ngxErrors="invalidInitialVal">
          <div *ngxError="'min'">${errorText()}</div>
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
            <div *ngxError="'required'">${errorText('Required')}</div>
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
          <div *ngxError="'min'">${errorText('min 10')}</div>
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
    describe('Inside ngxError directive', () => {
      const template = `
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="number" formControlName="invalidInitialVal" />

        <div ngxErrors="invalidInitialVal">
          <div *ngxError="'min'; let err">
            Number should be greater than {{err.min}}. You've typed {{err.actual}}.
          </div>
        </div>

        <button type="submit"></button>
      </form>`;

      it('should access error details', fakeAsync(() => {
        const { spectator } = setupDirectiveWithConfig(template, undefined);
        spectator.click('button');
        spectator.tick();
        flush();
        spectator.detectChanges();

        expect(spectator.element).toContainText(
          "Number should be greater than 10. You've typed 3.",
        );
      }));

      it('should access new error details after a change', fakeAsync(() => {
        const { spectator } = setupDirectiveWithConfig(template, undefined);
        spectator.typeInElement('4', 'input');
        spectator.blur('input');
        spectator.tick(0);
        flush();
        spectator.detectChanges();

        expect(spectator.element).toContainText(
          "Number should be greater than 10. You've typed 4.",
        );

        spectator.typeInElement('6', 'input');
        spectator.blur('input');
        flush();
        spectator.tick(0);
        flush();
        spectator.detectChanges();

        expect(spectator.element).toContainText(
          "Number should be greater than 10. You've typed 6.",
        );
      }));
    });

    describe('Outside ngxError directive', () => {
      const template = `
      <form [formGroup]="form" (ngSubmit)="submit()">
        <input type="number" formControlName="invalidInitialVal" />

        <div ngxErrors="invalidInitialVal">
          <ng-template ngxError="min" ref-ngxError="ngxError"></ng-template>
        </div>

        <div id="error-outside-expected" *ngIf="ngxError.err.min">min: {{ngxError.err.min}}</div>
        <div id="error-outside-actual" *ngIf="ngxError.err.min">actual: {{ngxError.err.actual}}</div>

        <button type="submit"></button>
      </form>`;

      it('should access error details and can use them outside of ngxErrors', fakeAsync(() => {
        const { spectator } = setupDirectiveWithConfig(template, undefined);
        spectator.click('button');
        spectator.tick();
        flush();
        spectator.detectChanges();

        expect(spectator.query('#error-outside-expected')).toContainText(
          'min: 10',
        );

        expect(spectator.query('#error-outside-actual')).toContainText(
          'actual: 3',
        );
      }));
    });
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
      forConfigShowWhenStates: ['touched'],
    });

    testErrorVisibilityForConfigShowWhenStates({
      template,
      action: (spectator) => {
        spectator.hostComponent.ngForm.form.markAllAsTouched();
      },
      expectedVisibility: false,
      forConfigShowWhenStates: ['dirty', 'touchedAndDirty', 'formIsSubmitted'],
    });
  });
});
