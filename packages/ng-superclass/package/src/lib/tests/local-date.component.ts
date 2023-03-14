import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FormComponentSuperclass } from '../form-component-superclass';

@Component({
  selector: 'ngs-local-date',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: ` <input type="datetime-local" [formControl]="viewModel" /> `,
})
export class LocalDateComponent extends FormComponentSuperclass<Date, string> {
  override viewModel = new FormControl<string>('', { nonNullable: true });

  override outerToInner = (incomingValues$: Observable<Date>) =>
    incomingValues$.pipe(
      map((date) => {
        if (!date) {
          return ''; // happens during initialization
        }
        return date.toISOString().substring(0, 16);
      })
    );

  override innerToOuter = (outgoingValues$: Observable<string>) =>
    outgoingValues$.pipe(
      map((inner) => {
        if (!inner) {
          return null as unknown as Date;
        }
        return new Date(inner + 'Z');
      })
    );

  override validate(control: AbstractControl) {
    const val = control.value;
    if (val instanceof Date) {
      if (val.getDate() === 16) {
        return { wrong: true };
      }
    }
    return null;
  }
}
