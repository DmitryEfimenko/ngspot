import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import {
  ErrorsConfiguration,
  IErrorsConfiguration,
  NgxErrorsModule,
} from '@ngspot/ngx-errors';
import { NgxErrorsMaterialModule } from '@ngspot/ngx-errors-material';

@Component({
  selector: 'ngs-with-module-demo-result',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxErrorsModule,
    NgxErrorsMaterialModule,
    MatInputModule,
  ],
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
export class WithModuleDemoResultComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required] }),
  });
}
