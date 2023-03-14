import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormComponentSuperclass } from '../form-component-superclass';

import { FullNameReactiveComponent } from './full-name-form-group.component';
import { OneInputComponent } from './one-input.component';

@Component({
  selector: 'ngs-nested',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OneInputComponent,
    FullNameReactiveComponent,
  ],
  template: `
    <ng-container *ngIf="variant === 1; else variantTwo">
      <ngs-one-input [formControl]="ngControl.control"></ngs-one-input>
    </ng-container>

    <ng-template #variantTwo>
      <ngs-full-name [formControl]="ngControl.control"></ngs-full-name>
    </ng-template>
  `,
})
export class NestedComponent extends FormComponentSuperclass<string> {
  @Input()
  variant: 1 | 2 = 1;
}
