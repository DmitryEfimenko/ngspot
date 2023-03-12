import { Component } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

import { FormComponentSuperclass } from '../form-component-superclass';

@Component({
  selector: 'ngs-counter',
  standalone: true,
  template: `
    <button (click)="increment()" (blur)="onTouched()">
      {{ viewModel.value }}
    </button>
  `,
})
export class CounterComponent extends FormComponentSuperclass<number> {
  override viewModel = new FormControl(0, { nonNullable: true });

  increment() {
    this.viewModel.setValue(this.viewModel.value + 1);
  }

  override validate(control: AbstractControl) {
    if (control.value === 2) {
      return { wrong: true };
    }
    return null;
  }
}
