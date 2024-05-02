/* eslint-disable @angular-eslint/directive-selector */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

import {
  BehaviorSubject,
  combineLatest,
  merge,
  NEVER,
  Observable,
  of,
  Subscription,
  timer,
} from 'rxjs';
import {
  auditTime,
  filter,
  first,
  map,
  switchMap,
  tap,
  share,
} from 'rxjs/operators';

import { ErrorStateMatchers } from './error-state-matchers.service';
import { ErrorsConfiguration } from './errors-configuration';
import { ErrorsDirective } from './errors.directive';
import { extractTouchedChanges } from './misc';
import {
  InvalidShowWhenError,
  NoParentNgxErrorsError,
  ValueMustBeStringError,
} from './ngx-errors';
import { OverriddenShowWhen } from './overridden-show-when.service';

/**
 * Directive to provide a validation error for a specific error name.
 * Used as a child of ngxErrors directive.
 *
 * Example:
 * ```html
 * <div [ngxErrors]="control">
 *   <div ngxError="required">This input is required</div>
 * </div>
 * ```
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngxError]',
  exportAs: 'ngxError',
})
export class ErrorDirective implements AfterViewInit, OnDestroy {
  private subs = new Subscription();

  @HostBinding('hidden')
  hidden = true;

  @Input('ngxError') errorName: string;

  @Input() showWhen: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any = {};
  private err$$ = new BehaviorSubject<any>({});

  constructor(
    private config: ErrorsConfiguration,
    private errorStateMatchers: ErrorStateMatchers,
    private overriddenShowWhen: OverriddenShowWhen,
    private cdr: ChangeDetectorRef,
    // ErrorsDirective is actually required.
    // use @Optional so that we can throw a custom error
    @Optional() private errorsDirective: ErrorsDirective
  ) {}

  ngAfterViewInit() {
    this.validateDirective();
    this.watchForEventsTriggeringVisibilityChange();
  }

  ngOnDestroy() {
    // without the timeout object gets destroyed before call finishes causing errors
    setTimeout(() => {
      this.errorsDirective?.visibilityChanged(
        this.errorName,
        this.showWhen,
        true
      );
    }, 0);

    this.subs.unsubscribe();
  }

  private watchForEventsTriggeringVisibilityChange() {
    const ngSubmit$ = this.errorsDirective.formDirective?.form
      ? this.errorsDirective.formDirective.form.ngSubmit.asObservable()
      : NEVER;

    let touchedChanges$: Observable<boolean>;

    const sub = this.errorsDirective.control$
      .pipe(
        tap((control) => {
          this.initConfig(control);
          this.watchForVisibilityChange(control);
        }),
        tap((control) => {
          touchedChanges$ = extractTouchedChanges(control);
          this.calcShouldDisplay(control);
        }),
        switchMap((control) => {
          // https://github.com/angular/angular/issues/41519
          // control.statusChanges do not emit when there's async validator
          // ugly workaround:
          let asyncBugWorkaround$: Observable<any> = NEVER;
          if (control.asyncValidator && control.status === 'PENDING') {
            asyncBugWorkaround$ = timer(0, 50).pipe(
              switchMap(() => of(control.status)),
              filter((x) => x !== 'PENDING'),
              first()
            );
          }

          return merge(
            control.valueChanges,
            control.statusChanges,
            touchedChanges$,
            ngSubmit$,
            asyncBugWorkaround$
          ).pipe(
            auditTime(0),
            map(() => control)
          );
        }),
        tap((control) => {
          this.calcShouldDisplay(control);
        })
      )
      .subscribe();

    this.subs.add(sub);
  }

  private calcShouldDisplay(control: AbstractControl) {
    const hasError = control.hasError(this.errorName);

    const controlError = control.getError(this.errorName) || {};
    if (
      JSON.stringify(this.err$$.getValue()) !== JSON.stringify(controlError)
    ) {
      this.err$$.next(controlError);
    }

    const form = this.errorsDirective.formDirective?.form ?? null;

    const errorStateMatcher = this.errorStateMatchers.get(this.showWhen);

    if (!errorStateMatcher) {
      throw new InvalidShowWhenError(
        this.showWhen,
        this.errorStateMatchers.validKeys()
      );
    }

    const hasErrorState = errorStateMatcher.isErrorState(control, form);

    const couldBeHidden = !(hasErrorState && hasError);

    this.errorsDirective.visibilityChanged(
      this.errorName,
      this.showWhen,
      couldBeHidden
    );
  }

  private watchForVisibilityChange(control: AbstractControl) {
    const key = `${this.errorName}-${this.showWhen}`;

    const sub = combineLatest([
      this.errorsDirective.visibilityForKey$(key),
      this.err$$,
    ])
      .pipe(
        tap(([hidden, err]) => {
          this.hidden = hidden;

          this.overriddenShowWhen.errorVisibilityChanged(
            control,
            this.errorName,
            this.showWhen,
            !this.hidden
          );

          this.err = err;

          this.cdr.detectChanges();
        })
      )
      .subscribe();

    this.subs.add(sub);
  }

  private initConfig(control: AbstractControl) {
    if (this.showWhen) {
      this.overriddenShowWhen.add(control);
      return;
    }

    if (this.errorsDirective.showWhen) {
      this.showWhen = this.errorsDirective.showWhen;
      this.overriddenShowWhen.add(control);
      return;
    }

    this.showWhen = this.config.showErrorsWhenInput;

    if (
      this.showWhen === 'formIsSubmitted' &&
      !this.errorsDirective.parentFormGroupDirective
    ) {
      this.showWhen = 'touched';
    }
  }

  private validateDirective() {
    if (this.errorsDirective == null) {
      throw new NoParentNgxErrorsError();
    }

    if (typeof this.errorName !== 'string' || this.errorName.trim() === '') {
      throw new ValueMustBeStringError();
    }
  }
}
