import { Injectable, WritableSignal, signal } from '@angular/core';
import {
  AbstractControl,
  FormControlStatus,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';

import {
  NEVER,
  Observable,
  ReplaySubject,
  asapScheduler,
  auditTime,
  filter,
  merge,
  of,
  share,
  switchMap,
  take,
  timer,
} from 'rxjs';

import { ErrorStateMatchers } from './error-state-matchers.service';
import {
  extractTouchedChanges,
  extractDirtyChanges,
} from './extract-control-changes';
import { MaybeParentForm } from './form.directive';
import { InvalidShowWhenError } from './ngx-errors';

type HasError = boolean;
type DirectiveId = number;

type ErrorState = Map<
  AbstractControl,
  {
    control: AbstractControl;
    parentForm: FormGroupDirective | NgForm | null;
    watchedEvents$: Observable<any>;
    registeredInstancesCount: number;
    errors: WritableSignal<Record<DirectiveId, HasError>>;
  }
>;

@Injectable({ providedIn: 'root' })
export class AllErrorsStateService {
  private state = signal<ErrorState>(new Map());

  registerControl(control: AbstractControl, parentForm: MaybeParentForm) {
    const alreadyRegisteredControl = this.state().get(control);

    if (alreadyRegisteredControl) {
      alreadyRegisteredControl.registeredInstancesCount++;
      return;
    }

    const watchedEvents$ = eventsTriggeringVisibilityChange$(
      control,
      parentForm,
    );

    this.state.update((map) => {
      map.set(control, {
        control,
        parentForm,
        watchedEvents$,
        registeredInstancesCount: 1,
        errors: signal({}),
      });

      return new Map(map);
    });
  }

  unregisterControl(control: AbstractControl) {
    const alreadyRegisteredControl = this.state().get(control);

    if (!alreadyRegisteredControl) {
      return;
    }

    alreadyRegisteredControl.registeredInstancesCount--;

    if (alreadyRegisteredControl.registeredInstancesCount === 0) {
      this.state.update((map) => {
        map.delete(control);
        return new Map(map);
      });
    }
  }

  getControlState(control: AbstractControl) {
    return this.state().get(control);
  }
}

export function getErrorStateMatcher(
  errorStateMatchers: ErrorStateMatchers,
  showWhen: string,
) {
  const errorStateMatcher = errorStateMatchers.get(showWhen);

  if (!errorStateMatcher) {
    throw new InvalidShowWhenError(showWhen, errorStateMatchers.validKeys());
  }

  return errorStateMatcher;
}

function eventsTriggeringVisibilityChange$(
  control: AbstractControl,
  form: FormGroupDirective | NgForm | null,
) {
  const ngSubmit$ = form ? form.ngSubmit.asObservable() : NEVER;

  const $ = merge(
    control.valueChanges,
    control.statusChanges,
    ngSubmit$,
    extractTouchedChanges(control),
    extractDirtyChanges(control),
    asyncBugWorkaround$(control),
    of(null),
  ).pipe(
    // using auditTime due to the fact that even though touch event
    // might fire, the control.touched won't be updated at the time
    // when ErrorStateMatcher check it
    auditTime(0, asapScheduler),
    share({
      connector: () => new ReplaySubject(1),
      resetOnComplete: true,
      resetOnError: true,
      resetOnRefCountZero: true,
    }),
  );

  return $;
}

/**
 * control.statusChanges do not emit when there's async validator
 * https://github.com/angular/angular/issues/41519
 * ugly workaround:
 */
function asyncBugWorkaround$(control: AbstractControl) {
  let $: Observable<FormControlStatus | never> = NEVER;
  if (control.asyncValidator && control.status === 'PENDING') {
    $ = timer(0, 50).pipe(
      switchMap(() => of(control.status)),
      filter((x) => x !== 'PENDING'),
      take(1),
    );
  }
  return $;
}
