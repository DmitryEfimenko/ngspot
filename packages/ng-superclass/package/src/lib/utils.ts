import { Provider, Type } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  defer,
  filter,
  Observable,
  OperatorFunction,
  pipe,
  startWith,
} from 'rxjs';

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function conditionalStartWith<T>(
  condition: () => boolean,
  cb: () => T
): OperatorFunction<unknown, T> {
  return function (source: Observable<any>) {
    return defer(() => {
      return condition() ? source.pipe(startWith(cb())) : source;
    });
  };
}
