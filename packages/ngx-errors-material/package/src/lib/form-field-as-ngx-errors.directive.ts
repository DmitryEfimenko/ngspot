/* eslint-disable @angular-eslint/directive-selector */
import { AfterViewInit, Directive, inject, signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MAT_FORM_FIELD } from '@angular/material/form-field';

import { NgxErrorsBase } from '@ngspot/ngx-errors';

@Directive({
  selector: 'mat-form-field',
  standalone: true,
  providers: [
    { provide: NgxErrorsBase, useExisting: FormFieldAsNgxErrorsDirective },
  ],
})
export class FormFieldAsNgxErrorsDirective
  extends NgxErrorsBase
  implements AfterViewInit
{
  override resolvedControl = signal<AbstractControl<any, any> | undefined>(
    undefined,
  );

  private formField = inject(MAT_FORM_FIELD, { self: true });

  ngAfterViewInit() {
    this.resolvedControl.set(
      this.formField._control.ngControl?.control ?? undefined,
    );
  }
}
