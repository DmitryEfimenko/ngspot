import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NGX_ERRORS_DECLARATIONS } from '@ngspot/ngx-errors';

@Component({
  selector: 'ngs-reactive-forms-demo-result',
  standalone: true,
  imports: [ReactiveFormsModule, NGX_ERRORS_DECLARATIONS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      [ngxerrors] {
        color: red;
      }
    `,
  ],
  template: `
    <form [formGroup]="form">
      <label>
        Name:
        <input formControlName="name" />
      </label>

      <div ngxErrors="name">
        <div *ngxError="'required'">Name is required</div>
      </div>
    </form>
  `,
})
export class ReactiveFormsDemoResultComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required] }),
  });
}
