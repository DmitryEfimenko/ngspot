import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { strongPasswordValidator } from './validator';

@Directive({
  selector: '[ngsStrongPassword]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StrongPasswordDirective,
      multi: true,
    },
  ],
})
export class StrongPasswordDirective implements Validator {
  private validator = strongPasswordValidator();

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return this.validator(control);
  }
}
