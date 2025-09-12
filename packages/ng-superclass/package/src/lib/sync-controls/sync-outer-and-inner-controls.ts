import { ChangeDetectorRef } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';

import {
  extractDirtyChanges,
  extractTouchedChanges,
  patchObjectMethodWith,
} from './extract-control-changes';

/**
 * Syncs the outer and inner controls for validity, errors, dirty, and touched states.
 * Used in components that implement ControlValueAccessor
 */
export function syncOuterAndInnerControls(
  ngControl: NgControl,
  innerControls: AbstractControl[],
  changeDetectorRef: ChangeDetectorRef,
  destroy$: Observable<boolean>,
) {
  if (!ngControl?.control) {
    return;
  }

  syncOuterToInnerErrors(ngControl, innerControls, changeDetectorRef, destroy$);
  syncOuterAndInnerTouched(
    ngControl,
    innerControls,
    changeDetectorRef,
    destroy$,
  );
  syncOuterAndInnerDirty(ngControl, innerControls, changeDetectorRef, destroy$);
}

export function syncOuterToInnerErrors(
  ngControl: NgControl,
  innerControls: AbstractControl[],
  changeDetectorRef: ChangeDetectorRef,
  destroy$: Observable<boolean>,
) {
  if (!ngControl || !ngControl.statusChanges) {
    return;
  }

  ngControl.statusChanges
    .pipe(
      startWith(ngControl.status),
      map(() => ngControl.errors),
      tap((errors) => {
        for (let i = 0; i < innerControls.length; i++) {
          const control = innerControls[i];
          control.setErrors(errors, { emitEvent: false });
        }
        changeDetectorRef.detectChanges();
      }),
      takeUntil(destroy$),
    )
    .subscribe();
}

export function syncOuterAndInnerTouched(
  ngControl: NgControl,
  innerControls: AbstractControl[],
  changeDetectorRef: ChangeDetectorRef,
  destroy$: Observable<boolean>,
) {
  if (!ngControl.control) {
    return;
  }

  const outerControl = ngControl.control;

  const touched$ = extractTouchedChanges(outerControl);

  touched$
    .pipe(
      startWith(outerControl.touched),
      tap((isTouched) => {
        for (let i = 0; i < innerControls.length; i++) {
          const control = innerControls[i];
          if (isTouched) {
            control.markAsTouched({ onlySelf: true });
          } else {
            control.markAsUntouched({ onlySelf: true });
          }
        }
        changeDetectorRef.detectChanges();
      }),
      takeUntil(destroy$),
    )
    .subscribe();

  // inner to outer
  for (let i = 0; i < innerControls.length; i++) {
    const control = innerControls[i];

    patchObjectMethodWith(control, 'markAsTouched', (args) => {
      if (!args?.onlySelf) {
        outerControl.markAsTouched();
      }
    });
  }
}

export function syncOuterAndInnerDirty(
  ngControl: NgControl,
  innerControls: AbstractControl[],
  changeDetectorRef: ChangeDetectorRef,
  destroy$: Observable<boolean>,
) {
  if (!ngControl.control) {
    return;
  }

  const outerControl = ngControl.control;

  const dirty$ = extractDirtyChanges(outerControl);

  dirty$
    .pipe(
      startWith(outerControl.dirty),
      tap((isDirty) => {
        for (let i = 0; i < innerControls.length; i++) {
          const control = innerControls[i];
          if (isDirty) {
            control.markAsDirty({ onlySelf: true });
          } else {
            control.markAsPristine({ onlySelf: true });
          }
        }
        changeDetectorRef.detectChanges();
      }),
      takeUntil(destroy$),
    )
    .subscribe();

  // inner to outer
  for (let i = 0; i < innerControls.length; i++) {
    const control = innerControls[i];

    patchObjectMethodWith(control, 'markAsDirty', (args) => {
      if (!args?.onlySelf) {
        outerControl.markAsDirty();
      }
    });
  }
}
