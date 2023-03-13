import { Component } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

import { FormComponentSuperclass } from '../form-component-superclass';

type OuterType = string | undefined;

@Component({
  selector: 'ngs-one-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `<input [formControl]="ngControl.control" />`,
})
export class OneInputComponent extends FormComponentSuperclass<OuterType> {
  override validate(control: AbstractControl<OuterType>) {
    if ((control.value?.length ?? 0) < 5) {
      return { minlength: 5 };
    }
    return null;
  }
}
