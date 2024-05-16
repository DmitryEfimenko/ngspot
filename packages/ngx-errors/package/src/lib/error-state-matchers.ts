import { Injectable } from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

import { IErrorStateMatcher } from './custom-error-state-matchers';

@Injectable({ providedIn: 'root' })
export class ShowOnTouchedErrorStateMatcher implements IErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    return !!(
      control &&
      control.invalid &&
      (control.touched || (form && form.submitted))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class ShowOnDirtyErrorStateMatcher implements IErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    return !!(
      control &&
      control.invalid &&
      (control.dirty || (form && form.submitted))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class ShowOnTouchedAndDirtyErrorStateMatcher
  implements IErrorStateMatcher
{
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    return !!(
      control &&
      control.invalid &&
      ((control.dirty && control.touched) || (form && form.submitted))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class ShowOnSubmittedErrorStateMatcher implements IErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    return !!(control && control.invalid && form && form.submitted);
  }
}
