/* eslint-disable @angular-eslint/directive-class-suffix */
/* eslint-disable @angular-eslint/directive-selector */
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  Injector,
  Input,
  OnDestroy,
  Provider,
  Type,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DirectiveSuperclass } from './directive-superclass';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

/**
 * Use in the `providers` of a component that implements `ControlValueAccessor` to reduce some boilerplate.
 *
 * ```ts
 * @Component({ providers: [provideValueAccessor(MyFormControl)] }
 * class MyFormControl extends BaseFormControl {
 *   // ...
 * }
 * ```
 */
export function provideValueAccessor(type: Type<any>): Provider {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: type,
    multi: true,
  };
}

let nextId = 1;

/**
 * Extend this when creating a form control to reduce some boilerplate.
 * In addition, this class happens to implement majority of the
 * MatFormFieldControl class. Thus, using this class simplifies
 * making custom form-field controls.
 * For more info see: https://material.angular.io/guide/creating-a-custom-form-field-control
 *
 * This example allows 2-way binding to a number via `[(ngModel)]`, `[formControl]`, or any other technique that leverages the `ControlValueAccessor` interface.
 * ```ts
 * @Component({
 *   template: `
 *     <button (click)="increment()" [disabled]="isDisabled">{{ counter }}</button>
 *   `,
 * })
 * class CounterComponent extends FormComponentSuperclass<number> {
 *   counter = 0;
 *
 *   handleIncomingValue(value: number) {
 *     this.counter = value;
 *   }
 *
 *   increment() {
 *     this.emitOutgoingValue(++this.counter);
 *     this.onTouched();
 *   }
 * }
 * ```
 */
@Directive({ selector: '[ngsFormComponentSuperclass]' })
export abstract class FormComponentSuperclass<T>
  extends DirectiveSuperclass
  implements ControlValueAccessor, OnDestroy
{
  /**
   * A reference to the outer control
   */
  ngControl: NgControl | null = null;

  /** Call this to "commit" a change, traditionally done e.g. on blur. */
  onTouched = noop;

  protected hostEl: HTMLElement;

  private focusMonitor: FocusMonitor;

  protected focusMonitor$: Observable<FocusOrigin>;

  private disabled$$ = new ReplaySubject<boolean>(1);
  disabled$ = this.disabled$$.asObservable();

  // #region Props of MatFormFieldControl
  private _value: T;
  get value() {
    return this._value;
  }
  set value(val: T) {
    this._value = val;
    this.stateChanges.next();
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @HostBinding()
  id = `super-comp-${nextId++}`;

  stateChanges = new Subject<void>();

  private _focused: boolean;
  get focused() {
    return this._focused;
  }
  set focused(val: boolean) {
    this._focused = val;
  }

  get empty(): boolean {
    return !this.value;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.disabled$$.next(this._disabled);
    this.stateChanges.next();
  }
  private _disabled = false;

  get errorState() {
    return this.ngControl?.invalid ?? false;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby')
  userAriaDescribedBy: string;
  // #endregion

  protected changeDetectorRef: ChangeDetectorRef;

  constructor(protected injector: Injector) {
    super();

    this.changeDetectorRef = injector.get(ChangeDetectorRef);
    const elRef = injector.get<ElementRef<HTMLElement>>(ElementRef);
    this.hostEl = elRef.nativeElement;

    this.focusMonitor = injector.get(FocusMonitor);

    this.provideValueAccessor();
    this.monitorFocus();
  }

  /** Call this to emit a new value when it changes. */
  emitOutgoingValue: (value: T) => void = noop;

  override ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.hostEl);
    super.ngOnDestroy();
  }

  /** Implement this to handle a new value coming in from outside. */
  abstract handleIncomingValue(value: T): void;

  /** Called as angular propagates value changes to this `ControlValueAccessor`. You normally do not need to use it. */
  writeValue(value: T): void {
    this.handleIncomingValue(value);
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  /** Called as angular sets up the binding to this `ControlValueAccessor`. You normally do not need to use it. */
  registerOnChange(fn: (value: T) => void): void {
    const patchedFn = (value: T) => {
      fn(value);
      this.value = value;
    };
    this.emitOutgoingValue = patchedFn;
  }

  /** Called as angular sets up the binding to this `ControlValueAccessor`. You normally do not need to use it. */
  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  /** Called as angular propagates disabled changes to this `ControlValueAccessor`. You normally do not need to use it. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Sets the instance of this component as the valueAccessor. Since this is
   * done here, there's no need to do that on the component that extends this class.
   * https://github.com/angular/components/blob/master/guides/creating-a-custom-form-field-control.md#ngcontrol
   */
  private provideValueAccessor() {
    this.ngControl = this.injector.get(NgControl, undefined, {
      optional: true,
      self: true,
    });

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;

      this.ngControl;
    }
  }

  private monitorFocus() {
    this.focusMonitor$ = this.focusMonitor.monitor(this.hostEl, true).pipe(
      tap((origin) => {
        this._focused = !!origin;
      })
    );

    this.subscribeTo(this.focusMonitor$);
  }
}
