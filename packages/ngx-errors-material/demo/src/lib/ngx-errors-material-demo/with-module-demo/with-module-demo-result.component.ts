import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import {
  NGX_ERRORS_MATERIAL_DECLARATIONS,
  provideNgxErrorsConfig,
} from '@ngspot/ngx-errors-material';

@Component({
  selector: 'ngs-with-module-demo-result',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    NGX_ERRORS_MATERIAL_DECLARATIONS,
  ],
  providers: [provideNgxErrorsConfig({ showErrorsWhenInput: 'dirty' })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <mat-form-field>
        <mat-label>Name</mat-label>

        <input matInput formControlName="name" />

        <mat-error *ngxError="'required'">Name is required</mat-error>
      </mat-form-field>
    </form>
  `,
})
export class WithModuleDemoResultComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required] }),
  });
}
