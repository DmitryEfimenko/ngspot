import {
  ChangeDetectorRef,
  InjectFlags,
  Injector,
  Provider,
  Type,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
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

/**
 * Extend this when creating a form control to reduce some boilerplate.
 *
 * This example allows 2-way binding to a number via `[(ngModel)]`, `[formControl]`, or any other technique that leverages the `ControlValueAccessor` interface.
 * ```ts
 * @Component({
 *   template: `
 *     <button (click)="increment()" [disabled]="isDisabled">{{ counter }}</button>
 *   `,
 *   providers: [provideValueAccessor(CounterComponent)],
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
export abstract class FormComponentSuperclass<T>
  extends DirectiveSuperclass
  implements ControlValueAccessor
{
  /**
   * A reference to the outer control
   */
  ngControl: NgControl | undefined;

  /** Call this to "commit" a change, traditionally done e.g. on blur. */
  onTouched = noop;

  /** You can bind to this in your template as needed. */
  isDisabled = false;

  protected changeDetectorRef: ChangeDetectorRef;

  constructor(protected injector: Injector) {
    super();

    this.changeDetectorRef = injector.get(ChangeDetectorRef);

    this.provideValueAccessor();
  }

  /** Call this to emit a new value when it changes. */
  emitOutgoingValue: (value: T) => void = noop;

  /** Implement this to handle a new value coming in from outside. */
  abstract handleIncomingValue(value: T): void;

  /** Called as angular propagates value changes to this `ControlValueAccessor`. You normally do not need to use it. */
  writeValue(value: T): void {
    this.handleIncomingValue(value);
    this.changeDetectorRef.markForCheck();
  }

  /** Called as angular sets up the binding to this `ControlValueAccessor`. You normally do not need to use it. */
  registerOnChange(fn: (value: T) => void): void {
    this.emitOutgoingValue = fn;
  }

  /** Called as angular sets up the binding to this `ControlValueAccessor`. You normally do not need to use it. */
  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  /** Called as angular propagates disabled changes to this `ControlValueAccessor`. You normally do not need to use it. */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Sets the instance of this component as the valueAccessor. Since this is
   * done here, there's no need to do that on the component that extends this class.
   * https://github.com/angular/components/blob/master/guides/creating-a-custom-form-field-control.md#ngcontrol
   */
  private provideValueAccessor() {
    this.ngControl = this.injector.get(
      NgControl,
      undefined,
      InjectFlags.Optional | InjectFlags.Self
    );

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }
}
