import { Provider, Type } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { filter, OperatorFunction, pipe } from 'rxjs';

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
 * @usage
 * ```
 * source$.pipe(filterOutNullish())
 * ```
 */
export function filterOutNullish<T>(): OperatorFunction<
  T | null | undefined,
  T
> {
  return pipe(filter((x): x is T => x != null));
}