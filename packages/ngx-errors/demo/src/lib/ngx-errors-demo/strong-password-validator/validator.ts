import { ValidatorFn, Validators } from '@angular/forms';

export type Criteria =
  | 'minChar'
  | 'lowerCase'
  | 'upperCase'
  | 'digit'
  | 'specialChar';

export const regExpValidators: Record<Criteria, RegExp> = {
  lowerCase: RegExp(/^(?=.*?[a-z])/),
  upperCase: RegExp(/^(?=.*?[A-Z])/),
  digit: RegExp(/^(?=.*?[0-9])/),
  specialChar: RegExp(/^(?=.*?[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])/),
  minChar: RegExp(`^.{8,30}$`),
};

export function strongPasswordValidator() {
  const validatorsArray: ValidatorFn[] = [];
  validatorsArray.push(Validators.required);

  for (const criteria in regExpValidators) {
    if (Object.prototype.hasOwnProperty.call(regExpValidators, criteria)) {
      const regex = regExpValidators[criteria as Criteria];

      const validator: ValidatorFn = (control) => {
        const value = control.value;
        if (!value) {
          return null;
        }
        const valid = regex.test(value);
        if (valid) {
          return null;
        }
        return {
          [criteria]: true,
        };
      };

      validatorsArray.push(validator);
    }
  }
  const validators = Validators.compose(validatorsArray);

  if (!validators) {
    throw new Error('impossible situation');
  }

  return validators;
}
