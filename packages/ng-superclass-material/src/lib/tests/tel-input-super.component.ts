import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FormComponentMaterialSuperclass } from '../form-component-material-superclass';

import { MyTel } from './tel-input.model';

@Component({
  selector: 'ngs-tel-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div
      role="group"
      class="example-tel-input-container"
      [formGroup]="viewModel"
      [attr.aria-labelledby]="formField?.getLabelId()"
    >
      <input
        #area
        class="example-tel-input-element"
        formControlName="area"
        size="3"
        maxLength="3"
        aria-label="Area code"
      />
      <span class="example-tel-input-spacer">&ndash;</span>
      <input
        #exchange
        class="example-tel-input-element"
        formControlName="exchange"
        maxLength="3"
        size="3"
        aria-label="Exchange code"
        (keyup.backspace)="autoFocusPrev(viewModel.controls.exchange, area)"
      />
      <span class="example-tel-input-spacer">&ndash;</span>
      <input
        #subscriber
        class="example-tel-input-element"
        formControlName="subscriber"
        maxLength="4"
        size="4"
        aria-label="Subscriber number"
        (keyup.backspace)="
          autoFocusPrev(viewModel.controls.subscriber, exchange)
        "
      />
    </div>
  `,
  styleUrls: ['./tel-input.scss'],
})
export class MyTelInputComponent extends FormComponentMaterialSuperclass<MyTel> {
  override viewModel = this._formBuilder.group({
    area: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
    ],
    exchange: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
    ],
    subscriber: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
    ],
  });

  constructor(private _formBuilder: FormBuilder) {
    super();
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this.focusMonitor.focusVia(prevElement, 'program');
    }
  }
}
