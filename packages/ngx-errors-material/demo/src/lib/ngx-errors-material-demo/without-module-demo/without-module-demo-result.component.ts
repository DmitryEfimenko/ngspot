import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import {
  ErrorsConfiguration,
  IErrorsConfiguration,
  NgxErrorsModule,
} from '@ngspot/ngx-errors';

@Component({
  selector: 'ngs-without-module-demo-result',
  standalone: true,
  imports: [ReactiveFormsModule, NgxErrorsModule, MatInputModule],
  providers: [
    {
      provide: ErrorsConfiguration,
      useValue: <IErrorsConfiguration>{ showErrorsWhenInput: 'dirty' },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <mat-form-field>
        <mat-label>Name</mat-label>

        <input matInput formControlName="name" />

        <mat-error ngxErrors="name">
          <span ngxError="required">Name is required</span>
        </mat-error>
      </mat-form-field>
    </form>
  `,
})
export class WithoutModuleDemoResultComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required] }),
  });
}
