/* eslint-disable @typescript-eslint/no-empty-function */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'ngs-counter',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CounterComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CounterComponent,
    },
  ],
  template: `
    <button [ngClass]="{ disabled }" (click)="increment()" (blur)="onTouched()">
      {{ quantity }}
    </button>
  `,
})
export class CounterComponent implements ControlValueAccessor, Validator {
  quantity = 0;

  touched = false;

  disabled = false;

  onChange = (_quantity: number) => {};

  onTouched = () => {};

  writeValue(quantity: number) {
    this.quantity = quantity;
  }

  registerOnChange(onChange: (quantity: number) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  increment() {
    if (!this.disabled) {
      this.quantity++;
      this.onChange(this.quantity);
    }
  }

  validate(control: AbstractControl) {
    if (control.value > 10) {
      return { tooMany: true };
    }
    return null;
  }
}
