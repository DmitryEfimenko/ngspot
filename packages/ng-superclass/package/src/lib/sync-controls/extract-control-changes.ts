/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbstractControl } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { ArgumentsType, MethodNames, TypeOfClassMethod } from '../typings';

export type AbstractControlMethods =
  | 'markAsTouched'
  | 'markAsUntouched'
  | 'markAsDirty'
  | 'markAsPristine';
export type EmitValue = boolean;
export type Methods = Partial<Record<AbstractControlMethods, EmitValue>>;

/**
 * Patches the method to first execute the provided function and then
 * the original functionality
 * @param obj Object with the method of interest
 * @param methodName Method name to patch
 * @param fn Function to execute before the original functionality
 */
export function patchObjectMethodWith<T, K extends MethodNames<T>>(
  obj: T,
  methodName: K,
  fn: TypeOfClassMethod<T, K>
) {
  const originalFn = (obj[methodName] as any).bind(obj) as TypeOfClassMethod<
    T,
    K
  >;

  function updatedFn(...args: [ArgumentsType<T[K]>]) {
    (fn as any)(...args);
    (originalFn as any)(...args);
  }

  obj[methodName] = updatedFn as unknown as T[K];
}

/**
 * Extract a touched changed observable from an abstract control
 * @param control AbstractControl
 *
 * @usage
 * ```
 * const formControl = new FormControl();
 * const touchedChanged$ = extractTouchedChanges(formControl);
 * ```
 */
export function extractTouchedChanges(
  control: AbstractControl
): Observable<boolean> {
  const methods: Methods = {
    markAsTouched: true,
    markAsUntouched: false,
  };
  return extractMethodsIntoObservable(control, methods).pipe(
    distinctUntilChanged()
  );
}

/**
 * Extract a dirty changed observable from an abstract control
 * @param control AbstractControl
 *
 * @usage
 * ```
 * const formControl = new FormControl();
 * const dirtyChanged$ = extractDirtyChanges(formControl);
 * ```
 */
export function extractDirtyChanges(
  control: AbstractControl
): Observable<boolean> {
  const methods: Methods = {
    markAsDirty: true,
    markAsPristine: false,
  };
  return extractMethodsIntoObservable(control, methods).pipe(
    distinctUntilChanged()
  );
}

function extractMethodsIntoObservable(
  control: AbstractControl,
  methods: Methods
) {
  const changes$ = new Subject<EmitValue>();

  Object.keys(methods).forEach((methodName) => {
    const emitValue = methods[methodName as keyof Methods];

    patchObjectMethodWith(
      control,
      methodName as MethodNames<AbstractControl>,
      () => {
        changes$.next(emitValue as boolean);
      }
    );
  });

  return changes$.asObservable();
}
