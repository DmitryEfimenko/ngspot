import { Directive, Optional, Self } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';

export type MaybeParentForm = FormGroupDirective | NgForm | null;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'form',
  exportAs: 'ngxErrorsForm',
  standalone: true,
})
export class NgxErrorsFormDirective {
  constructor(
    @Self() @Optional() private ngForm: NgForm | null,
    @Self() @Optional() private formGroupDirective: FormGroupDirective | null,
  ) {}

  get form(): MaybeParentForm {
    return this.ngForm ?? this.formGroupDirective;
  }
}
