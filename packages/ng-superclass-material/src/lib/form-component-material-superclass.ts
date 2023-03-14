/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/directive-class-suffix */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, DoCheck, HostBinding, inject, Input } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';

import { FormComponentSuperclass } from '@ngspot/ng-superclass';

/**
 * The superclass cannot implement certain methods of MatFormFieldControl.
 * These methods must be implemented in the consuming component.
 */
type LimitedMatFormFieldControl<T> = Omit<
  MatFormFieldControl<T>,
  'setDescribedByIds' | 'onContainerClick'
>;

/**
 * Class provides default implementation for the most of MatFormFieldControl interface
 * Couple methods can't have a default implementation since it would completely
 * depend on the custom component. Feel free to override any of the methods/properties
 * based on the needs of your custom component.
 */
@Directive()
export abstract class FormComponentMaterialSuperclass<
    OuterType,
    InnerType = OuterType
  >
  extends FormComponentSuperclass<OuterType, InnerType>
  implements DoCheck, LimitedMatFormFieldControl<OuterType>
{
  private defaultErrorStateMatcher = inject(ErrorStateMatcher);

  @Input()
  errorStateMatcher: ErrorStateMatcher;

  // #region Props of MatFormFieldControl
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(val) {
    this._placeholder = val;
    this.stateChanges.next();
  }
  private _placeholder: string;

  get empty(): boolean {
    return !this.value;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(req: boolean | string) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  errorState = false;

  @Input('aria-describedby')
  userAriaDescribedBy: string;

  parentForm = inject(NgForm, { optional: true });
  parentFormGroup = inject(FormGroupDirective, { optional: true });
  // #endregion

  ngDoCheck() {
    // We need to re-evaluate this on every change detection cycle, because there are some
    // error triggers that we can't subscribe to (e.g. parent form submissions). This means
    // that whatever logic is in here has to be super lean or we risk destroying the performance.
    this.updateErrorState();
  }

  private updateErrorState() {
    const control = this.ngControl ? this.ngControl.control : null;
    if (!control) {
      return;
    }
    const oldState = this.errorState;
    const parent = this.parentFormGroup ?? this.parentForm;
    const matcher = this.errorStateMatcher ?? this.defaultErrorStateMatcher;
    const newState = matcher.isErrorState(control, parent);

    if (newState !== oldState) {
      this.errorState = newState;
      this.stateChanges.next();
    }
  }
}
