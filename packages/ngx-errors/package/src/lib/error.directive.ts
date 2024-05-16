/* eslint-disable @angular-eslint/directive-selector */
import {
  AfterViewInit,
  ChangeDetectorRef,
  computed,
  Directive,
  effect,
  EmbeddedViewRef,
  inject,
  input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { combineLatest, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { getErrorStateMatcher } from './all-errors-state.service';
import { ErrorStateMatchers } from './error-state-matchers.service';
import { NgxErrorsBase } from './errors-base.directive';
import { ERROR_CONFIGURATION, ShowErrorWhen } from './errors-configuration';
import { filterOutNullish } from './misc';
import { ValueMustBeStringError } from './ngx-errors';

let errorDirectiveId = 0;

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
  standalone: true,
})
export class ErrorDirective implements AfterViewInit, OnDestroy {
  private subs = new Subscription();

  private config = inject(ERROR_CONFIGURATION);

  private errorStateMatchers = inject(ErrorStateMatchers);

  private errorsDirective = inject(NgxErrorsBase);

  private templateRef = inject(TemplateRef);

  private viewContainerRef = inject(ViewContainerRef);

  private cdr = inject(ChangeDetectorRef);

  private view: EmbeddedViewRef<any> | undefined;

  private errorDirectiveId = ++errorDirectiveId;

  errorName = input.required<string>({ alias: 'ngxError' });

  showWhen = input<ShowErrorWhen>('', { alias: 'ngxErrorShowWhen' });

  private computedShowWhen = computed(() => {
    const errorDirectiveShowWhen = this.showWhen();
    if (errorDirectiveShowWhen) {
      return errorDirectiveShowWhen;
    }

    const errorsDirectiveShowWhen = this.errorsDirective.showWhen();
    if (errorsDirectiveShowWhen) {
      return errorsDirectiveShowWhen;
    }

    if (
      this.config.showErrorsWhenInput === 'formIsSubmitted' &&
      !this.errorsDirective.parentControlContainer
    ) {
      return 'touched';
    }

    return this.config.showErrorsWhenInput;
  });

  private errorStateMatcher = computed(() => {
    const showWhen = this.computedShowWhen();
    return getErrorStateMatcher(this.errorStateMatchers, showWhen);
  });

  private controlState$ = toObservable(this.errorsDirective.controlState).pipe(
    filterOutNullish(),
  );

  /**
   * Calculates whether the error could be shown based on the result of
   * ErrorStateMatcher and whether there is an error for this particular errorName
   * The calculation does not take into account config.showMaxErrors
   *
   * In addition, it observable produces a side-effect of updating NgxErrorsStateService
   * with the information of whether this directive could be shown and a side-effect
   * of updating err object in case it was mutated
   */
  private couldBeShown$ = combineLatest([
    this.controlState$,
    toObservable(this.errorName),
    toObservable(this.errorStateMatcher),
  ]).pipe(
    switchMap(([controlState, errorName, errorStateMatcher]) =>
      controlState.watchedEvents$.pipe(
        map(() => ({
          controlState,
          errorName,
          errorStateMatcher,
        })),
      ),
    ),
    map(({ controlState, errorName, errorStateMatcher }) => {
      const isErrorState = errorStateMatcher.isErrorState(
        controlState.control,
        controlState.parentForm,
      );

      const hasError = controlState.control.hasError(errorName);
      const couldBeShown = isErrorState && hasError;

      const prevCouldBeShown = controlState.errors()[this.errorDirectiveId];

      return {
        prevCouldBeShown,
        couldBeShown,
        errorName,
        controlState,
        hasError,
      };
    }),
    tap(
      ({
        controlState,
        errorName,
        prevCouldBeShown,
        couldBeShown,
        hasError,
      }) => {
        if (prevCouldBeShown !== couldBeShown) {
          controlState.errors.update((errors) => {
            return { ...errors, [this.errorDirectiveId]: couldBeShown };
          });
        }

        const err = controlState.control.getError(errorName);

        const errorUpdated =
          hasError && JSON.stringify(this.err) !== JSON.stringify(err);

        if (errorUpdated) {
          this.err = err;
          if (this.view) {
            this.view.context.$implicit = this.err;
            this.view.markForCheck();
          }
        }
      },
    ),
  );

  private subscribeToCouldBeShown = this.subs.add(
    this.couldBeShown$.subscribe(),
  );

  /**
   * Determines whether the error is shown to the user based on
   * the value of couldBeShown and the config.showMaxErrors.
   * In addition, this reacts to the changes in visibility for all
   * errors associated with the control
   */
  private isShown = computed(() => {
    const controlState = this.errorsDirective.controlState();
    if (!controlState) {
      return false;
    }

    const errors = controlState.errors();

    const couldBeShown = errors[this.errorDirectiveId];

    if (!couldBeShown) {
      return false;
    }

    const { showMaxErrors } = this.config;
    if (!showMaxErrors) {
      return true;
    }

    // get all errors for this control that are possibly visible,
    // take directive ids associated with them, sort them
    // and show only these with index <= to config.showMaxErrors
    return Object.entries(errors)
      .reduce((acc, curr) => {
        const [id, couldBeShown] = curr;
        if (couldBeShown) {
          acc.push(Number(id));
        }
        return acc;
      }, [] as number[])
      .sort()
      .filter((_, ix) => ix < showMaxErrors)
      .includes(this.errorDirectiveId);
  });

  private isShownEffect = effect(() => {
    const isShown = this.isShown();
    const control = this.errorsDirective.resolvedControl();

    if (!control) {
      return;
    }

    const prevHidden = this.hidden;
    this.hidden = !isShown;

    if (isShown) {
      this.err = control.getError(this.errorName());
    } else {
      this.err = {};
    }

    if (prevHidden !== this.hidden) {
      this.toggleVisibility();
    }

    this.cdr.detectChanges();
  });

  hidden = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any = {};

  ngAfterViewInit() {
    this.validateDirective();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private toggleVisibility() {
    if (this.hidden) {
      if (this.view) {
        this.view.destroy();
        this.view = undefined;
      }
    } else {
      if (this.view) {
        this.view.context.$implicit = this.err;
        this.view.markForCheck();
      } else {
        this.view = this.viewContainerRef.createEmbeddedView(this.templateRef, {
          $implicit: this.err,
        });
      }
    }
  }

  private validateDirective() {
    const errorName = this.errorName();
    if (typeof errorName !== 'string' || errorName.trim() === '') {
      throw new ValueMustBeStringError();
    }
  }
}
