import { Directive } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { WrappedControlSuperclass } from './wrapped-control-superclass';

/**
 * This is a convenience class to make it easier to extend {@linkcode WrappedControlSuperclass} when you specifically want a `FormControl` (as opposed to a `FormArray` or `FormGroup`).
 */
@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class WrappedFormControlSuperclass<
  OuterType,
  InnerType = OuterType
> extends WrappedControlSuperclass<OuterType, InnerType> {
  control = new FormControl();
  innerControlValues$: Observable<InnerType> = this.control.valueChanges.pipe(
    startWith(this.control.value)
  );
}
