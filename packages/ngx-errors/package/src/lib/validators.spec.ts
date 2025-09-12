import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { dependentValidator } from './validators';

function matchValidator<T>(compareVal: T): ValidatorFn {
  return function (control: AbstractControl): ValidationErrors | null {
    return control.value === compareVal
      ? null
      : { match: { expected: compareVal, actual: control.value } };
  };
}

describe(dependentValidator.name, () => {
  function setup(opts: {
    controlAValue: string;
    controlBValue: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    condition: ((val?: any) => boolean) | undefined;
  }) {
    // eslint-disable-next-line jasmine/no-unsafe-spy
    const matchValidatorSpy = jasmine
      .createSpy('matchValidator', matchValidator)
      .and.callThrough();

    const controlA = new FormControl(opts.controlAValue);
    const controlB = new FormControl(
      opts.controlBValue,
      dependentValidator<string>({
        watchControl: () => controlA,
        validator: (val) => matchValidator(val),
        condition: opts.condition,
      }),
    );

    return { controlA, controlB, matchValidatorSpy };
  }

  it('GIVEN: controlA.value === controlB.value; Control B is valid', () => {
    const { controlB } = setup({
      controlAValue: '',
      controlBValue: '',
      condition: undefined,
    });

    expect(controlB.valid).toBe(true);
  });

  it('GIVEN: controlA.value !== controlB.value; Control B is invalid', () => {
    const { controlB } = setup({
      controlAValue: 'asd',
      controlBValue: '',
      condition: undefined,
    });

    expect(controlB.valid).toBe(false);
  });

  it('GIVEN: controlA.value !== controlB.value, then updated to match; Control B is valid', () => {
    const { controlA, controlB } = setup({
      controlAValue: 'asd',
      controlBValue: 'qwe',
      condition: undefined,
    });

    controlA.setValue('qwe');

    expect(controlB.valid).toBe(true);
  });

  describe('condition is provided', () => {
    it('GIVEN: condition returns false; Control B is valid', () => {
      const { controlB } = setup({
        controlAValue: 'not Dima',
        controlBValue: 'two',
        condition: (val) => val === 'Dima',
      });

      expect(controlB.valid).toBe(true);
    });

    it('GIVEN: condition returns true; Control B is invalid', () => {
      const { controlB } = setup({
        controlAValue: 'Dima',
        controlBValue: 'two',
        condition: (val) => val === 'Dima',
      });

      expect(controlB.valid).toBe(false);
    });
  });
});
