import { Component, inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

import { map, Observable } from 'rxjs';

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
  providers: [
    { provide: MatFormFieldControl, useExisting: MyTelInputComponent },
  ],
})
export class MyTelInputComponent
  extends FormComponentMaterialSuperclass<MyTel>
  implements MatFormFieldControl<MyTel>
{
  private _formBuilder = inject(FormBuilder);

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

  @ViewChild('area') areaInput: HTMLInputElement;
  @ViewChild('exchange') exchangeInput: HTMLInputElement;
  @ViewChild('subscriber') subscriberInput: HTMLInputElement;

  override get empty() {
    const {
      value: { area, exchange, subscriber },
    } = this.viewModel;

    return !area && !exchange && !subscriber;
  }

  override outerToInner = (values$: Observable<MyTel>) =>
    values$.pipe(map((value) => value ?? new MyTel('', '', '')));

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this.focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this.hostEl.querySelector(
      '.example-tel-input-container'
    );
    controlElement?.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    if (this.viewModel.controls.subscriber.valid) {
      this.focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.viewModel.controls.exchange.valid) {
      this.focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.viewModel.controls.area.valid) {
      this.focusMonitor.focusVia(this.exchangeInput, 'program');
    } else {
      this.focusMonitor.focusVia(this.areaInput, 'program');
    }
  }
}
