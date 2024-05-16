import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Extract arguments of function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ArgumentsType<F> = F extends (...args: infer A) => any ? A : never;

/**
 * Marks the provided control as well as all of its children as dirty
 * @param options to be passed into control.markAsDirty() call
 */
export function markDescendantsAsDirty(
  control: AbstractControl,
  options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  },
) {
  control.markAsDirty(options);

  if (control instanceof FormGroup || control instanceof FormArray) {
    const controls = Object.keys(control.controls).map(
      (controlName) => control.get(controlName) as AbstractControl,
    );

    controls.forEach((c) => {
      c.markAsDirty(options);

      if ((c as FormGroup | FormArray).controls) {
        markDescendantsAsDirty(c, options);
      }
    });
  }
}

export function filterOutNullish<T>(): UnaryFunction<
  Observable<T | null | undefined>,
  Observable<T>
> {
  return pipe(
    filter((x) => x != null) as OperatorFunction<T | null | undefined, T>,
  );
}
