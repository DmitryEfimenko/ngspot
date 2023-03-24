import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

import { FormComponentSuperclass } from '../form-component-superclass';

@Component({
  selector: 'ngs-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [ngClass]="{ disabled }" (click)="increment()" (blur)="onTouched()">
      {{ viewModel.value }}
    </button>
  `,
})
export class CounterComponent extends FormComponentSuperclass<number> {
  override viewModel = new FormControl(0, { nonNullable: true });

  increment() {
    if (!this.disabled) {
      this.viewModel.setValue(this.viewModel.value + 1);
    }
  }

  override validate(control: AbstractControl) {
    if (control.value > 10) {
      return { tooMany: true };
    }
    return null;
  }
}
