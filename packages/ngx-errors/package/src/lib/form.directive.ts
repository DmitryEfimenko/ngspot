import { Directive, inject } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';

export type MaybeParentForm = FormGroupDirective | NgForm | null;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'form',
  exportAs: 'ngxErrorsForm',
  standalone: true,
})
export class NgxErrorsFormDirective {
  ngForm: NgForm | null = inject(NgForm, { self: true, optional: true });
  formGroupDirective: FormGroupDirective | null = inject(FormGroupDirective, {
    self: true,
    optional: true,
  });

  get form(): MaybeParentForm {
    return this.ngForm ?? this.formGroupDirective;
  }
}
