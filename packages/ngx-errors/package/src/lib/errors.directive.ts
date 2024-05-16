/* eslint-disable @angular-eslint/directive-selector */
import {
  AfterViewInit,
  Directive,
  signal,
  input,
  computed,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

import { NgxErrorsBase } from './errors-base.directive';
import {
  ControlInstanceError,
  ControlNotFoundError,
  NoControlError,
  ParentFormGroupNotFoundError,
} from './ngx-errors';

/**
 * Directive to hook into the errors of a given control.
 *
 * Example:
 *
 * ```ts
 * \@Component({
 *   template: `
 *   <div [ngxErrors]="myControl">
 *     <div ngxError="required">This input is required</div>
 *   </div>
 *   `
 * })
 * export class MyComponent {
 *   myControl = new FormControl('', Validators.required)
 * }
 * ```
 * In case the `ngxErrors` directive is a child of a [formGroup], you can specify
 * the control by the control name similarly how you'd do it with formControlName:
 *
 * ```ts
 * \@Component({
 *   template: `
 *   <form [formGroup]="form">
 *     <div ngxErrors="firstName">
 *       <div ngxError="required">This input is required</div>
 *     </div>
 *   </form>
 *   `
 * })
 * export class MyComponent {
 *   form = this.fb.group({
 *     firstName: ['', Validators.required]
 *   });
 *   constructor(private fb: FormBuilder) {}
 * }
 * ```
 */
@Directive({
  selector: '[ngxErrors]',
  exportAs: 'ngxErrors',
  standalone: true,
  providers: [{ provide: NgxErrorsBase, useExisting: ErrorsDirective }],
})
export class ErrorsDirective extends NgxErrorsBase implements AfterViewInit {
  controlInput = input.required<AbstractControl | string>({
    alias: 'ngxErrors',
  });

  resolvedControl = computed(() => {
    const controlInput = this.controlInput();

    // initialize directive only after control input was set AND after
    // afterViewInit since parentFormGroupDirective might not be resolved
    // before that
    if (!this.afterViewInitComplete()) {
      return;
    }

    if (!controlInput) {
      throw new NoControlError();
    }

    if (typeof controlInput === 'string') {
      if (!this.parentControlContainer) {
        throw new ParentFormGroupNotFoundError(controlInput);
      }

      const control = this.parentControlContainer.control?.get(controlInput);

      if (control == null) {
        throw new ControlNotFoundError(controlInput);
      }

      return control;
    }

    if (!this.isAbstractControl(controlInput)) {
      throw new ControlInstanceError();
    }

    return controlInput;
  });

  private afterViewInitComplete = signal(false);

  ngAfterViewInit() {
    setTimeout(() => {
      // Use of the setTimeout to ensure that the controlInput was surely set
      // in all cases. In particular the edge-case where ngModelGroup
      // declared via template driven forms results in the control being
      // set later than ngAfterViewInit life-cycle hook is called
      this.afterViewInitComplete.set(true);
    }, 0);
  }

  private isAbstractControl(
    control: AbstractControl | string,
  ): control is AbstractControl {
    return (
      control instanceof FormControl ||
      control instanceof FormArray ||
      control instanceof FormGroup
    );
  }
}
