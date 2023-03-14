/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/directive-class-suffix */
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormControlDirective,
  FormControlName,
  FormGroup,
  NgControl,
  NgModel,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import {
  BehaviorSubject,
  merge,
  Observable,
  of,
  ReplaySubject,
  Subject,
} from 'rxjs';
import {
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';

import { DirectiveSuperclass } from './directive-superclass';
import { syncOuterAndInnerControls } from './sync-controls/sync-outer-and-inner-controls';
import { filterOutNullish } from './utils';

let nextId = 1;

/**
 * Extend this when creating a form control to reduce some boilerplate.
 *
 * When you simply need to use the same control that you're binding to via ngModel or formControl
 * on the inside of your custom component, then simply bind the inside control to `ngControl.control`:
 * ```ts
 * @Component({
 *   selector: 'app-one-input',
 *   template: `
 *     <input [formControl]="ngControl.control" />
 *   `,
 * })
 * export class OneInputComponent extends FormComponentSuperclass<string> {}
 * ```
 *
 * If you have some custom component logic that requires its own state management,
 * use viewModel as the internal state
 * ```ts
 * @Component({
 *   selector: 'app-counter',
 *   template: `
 *     <button (click)="increment()" (blur)="onTouched()">
 *       {{ viewModel.value }}
 *     </button>
 *   `,
 * })
 * export class CounterComponent extends FormComponentSuperclass<number> {
 *   viewModel = new FormControl(0);
 *
 *   increment() {
 *     this.viewModel.setValue(this.viewModel.value + 1);
 *   }
 * }
 * ```
 *
 * Example when you need to transform the value used outside of the component to the
 * structure representing internal viewModel:
 * ```ts
 * @Component({
 *   selector: 'app-local-date',
 *   template: `
 *     <input [formControl]="viewModel" type="datetime-local" />
 *   `,
 * })
 * export class LocalDateComponent extends FormComponentSuperclass<Date, string> {
 *   viewModel = new FormControl();
 *
 *   outerToInner(incomingValues$: Observable<Date>): Observable<string> {
 *     return incomingValues$.pipe(
 *       map((date) => {
 *         if (!date) {
 *           return ''; // happens during initialization
 *         }
 *         return date.toISOString().substr(0, 16);
 *       })
 *     );
 *   }
 *
 *   innerToOuter(outgoingValues$: Observable<string>): Observable<Date> {
 *     return outgoingValues$.pipe(
 *       map((inner) => {
 *         if (!inner) {
 *           return (null as unknown) as Date;
 *         }
 *         return new Date(inner + 'Z');
 *       })
 *     );
 *   }
 * }
 * ```
 */
@Directive()
export abstract class FormComponentSuperclass<OuterType, InnerType = OuterType>
  extends DirectiveSuperclass
  implements ControlValueAccessor, OnChanges, OnDestroy
{
  /**
   * A reference to the outer control. Use ngControl.control inside of the template
   * if you want to simply forward the outer control.
   */
  ngControl: FormControlDirective | FormControlName | NgModel;

  /**
   * Tracks internal control value (view-model).
   */
  protected viewModel?:
    | AbstractControl<InnerType>
    | FormGroup<{ [K in keyof InnerType]: any }>
    | FormArray<any>;

  /**
   * Resolved viewModel.
   *
   * Since `viewModel` is set in the class that extends from this class,
   * the `this.viewModel` is undefined at the time the observable expression
   * is defined. That's why we use the trick of `of(null).pipe(map(() => ...))`.
   * This way `this.viewModel` is defined when observable is subscribed to.
   */
  private viewModel$ = of(null).pipe(
    map(() => this.viewModel as AbstractControl<InnerType>),
    filterOutNullish()
  );

  private viewModelValueChanges$ = this.viewModel$.pipe(
    switchMap((viewModel) => viewModel.valueChanges)
  );

  /**
   * Stream of values that are either set on the outer control
   * or set via the value property
   */
  private incomingValues$$ = new ReplaySubject<OuterType>(1);

  protected hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private focusMonitor = inject(FocusMonitor);

  /**
   * Built-in validator reference
   */
  private validator: ValidatorFn | undefined;

  protected focusMonitor$: Observable<FocusOrigin>;

  private disabled$$ = new BehaviorSubject<boolean>(false);
  disabled$ = this.disabled$$.asObservable();

  protected changeDetectorRef = inject(ChangeDetectorRef);

  @HostBinding()
  id = `super-comp-${nextId++}`;

  stateChanges = new Subject<void>();

  get value() {
    return this._value;
  }
  set value(val: OuterType) {
    if (val !== this._value) {
      this.incomingValues$$.next(val);
    }
  }
  private _value: OuterType;

  @Input()
  get disabled(): boolean {
    return this.disabled$$.getValue();
  }
  set disabled(value: boolean | string) {
    this.disabled$$.next(coerceBooleanProperty(value));
    this.stateChanges.next();
  }

  private _focused: boolean;
  get focused() {
    return this._focused;
  }
  set focused(val: boolean) {
    this._focused = val;
  }

  /**
   * Stream that takes all incoming values, optionally applies user-provided
   * transformation, and commits the value to the inner form control
   */
  private outerToInner$ = of(null).pipe(
    switchMap(() => this.incomingValues$$),
    tap((value) => {
      this._value = value;
      // workaround for an edge case where if template-driven binding is
      // used for the outer control, typing in the inner control does not
      // reflect on the outer control
      if (this.ngControl instanceof NgModel) {
        this.ngControl.control.setValue(value, {
          emitEvent: false,
          onlySelf: true,
        });
      }
    }),
    switchMap((val) => {
      return of(val).pipe((s) => this.outerToInner(s));
    }),
    tap((value) => {
      this.viewModel?.setValue(value as any, { emitEvent: false });
      this.viewModel?.updateValueAndValidity({ emitEvent: false });
      this.stateChanges.next();
      this.changeDetectorRef.detectChanges();
    }),
    shareReplay(1)
  );

  /**
   * Stream that listens to values as user types in the input, optionally applies
   * user-provided transformation, and emits the result to the outer form control
   */
  private innerToOuter$ = this.viewModelValueChanges$.pipe(
    switchMap((val) => {
      return of(val).pipe((s) => this.innerToOuter(s));
    }),
    filter((value) => !this.ngControl || this.ngControl.value !== value),
    tap((value) => {
      this.emitOutgoingValue(value);
    }),
    shareReplay(1)
  );

  latestValue$ = merge(
    of<null>(null),
    this.incomingValues$$,
    this.innerToOuter$
  );

  innerControlValues$: Observable<InnerType> = this.viewModel$.pipe(
    switchMap((viewModel) =>
      viewModel.valueChanges.pipe(startWith(viewModel.value))
    )
  );

  constructor() {
    super();
    this.provideValueAccessor();
    this.monitorFocus();

    void Promise.resolve().then(() => {
      if (this.ngControl) {
        this.subscribeTo(
          this.ngControl.control.valueChanges.pipe(
            startWith(this.ngControl.control.value),
            filter((val) => val !== this._value),
            tap(this.incomingValues$$)
          )
        );
      }
      this.subscribeTo(this.outerToInner$);
      this.subscribeTo(this.innerToOuter$);
      this.setupValidator();
      this.syncOuterAndInnerControls();
    });

    const markAsDirty$ = this.viewModel$.pipe(
      switchMap((viewModel) =>
        viewModel.valueChanges.pipe(tap(() => viewModel.markAsDirty()))
      )
    );
    this.subscribeTo(markAsDirty$);
  }

  override ngOnChanges(changes: any) {
    // need to call detectChanges for an edge-case where switching between
    // two child custom control components with built-in validation results
    // in a different error for the outer control. Without calling detectChanges
    // ExpressionChangedAfterItHasBeenCheckedError is thrown.
    // ATTENTION! I could not come up with a unit-test for this. Modify with
    // manual thorough testing.
    this.changeDetectorRef.detectChanges();
    super.ngOnChanges(changes);
  }

  override ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.hostEl);
    if (this.validator && this.ngControl) {
      this.ngControl.control.removeValidators(this.validator);
    }
    super.ngOnDestroy();
  }

  /**
   * Implement this method in the consuming component for built-in validation.
   * @param control The control being validated
   */
  validate?(control: AbstractControl<OuterType>): ValidationErrors | null;

  // these three are a part of ControlValueAccessor interface
  // we do not implement them so that we can use either the forwarded
  // ngModel.control or the viewModel in the template
  writeValue() {}
  registerOnChange() {}
  registerOnTouched() {}

  /** Call this to "commit" a control visit, traditionally done e.g. on blur. */
  onTouched() {
    this.viewModel?.markAsTouched();
  }

  /** Called as angular propagates disabled changes to this `ControlValueAccessor`. You normally do not need to use it. */
  setDisabledState(isDisabled: boolean): void {
    this.disabled$$.next(isDisabled);
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Override this to modify a value coming from the outside to the format needed within this component.
   * Example:
   * ```ts
   * return values$.pipe(map(val => val.toString()));
   * ```
   * @param values$ Stream of values set from the outside
   * @returns Stream of transformed values that conform to the type of inner control
   */
  protected outerToInner = (
    values$: Observable<OuterType>
  ): Observable<InnerType> => {
    return values$ as unknown as Observable<InnerType>;
  };

  /**
   * Override this to modify a value coming from within this component to the format expected on the outside.
   * Example:
   * ```ts
   * return values$.pipe(map(val => parseInt(val)));
   * ```
   * @param values$ Stream of inner formControl.valueChanges
   * @returns Stream of transformed values that conform to the type of outer control
   */
  protected innerToOuter = (
    values$: Observable<InnerType>
  ): Observable<OuterType> => {
    return values$ as unknown as Observable<OuterType>;
  };

  /**
   * Call this to emit a new value when it changes.
   */
  private emitOutgoingValue(value: OuterType) {
    this._value = value;
    if (!this.ngControl?.control) {
      return;
    }
    this.ngControl.control.setValue(value);
    this.ngControl.control.markAsDirty();
    this.stateChanges.next();
  }

  /**
   * Sets the instance of this component as the valueAccessor. Since this is
   * done here, there's no need to do that on the component that extends this class.
   * https://github.com/angular/components/blob/master/guides/creating-a-custom-form-field-control.md#ngcontrol
   */
  private provideValueAccessor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    if (
      ngControl != null &&
      (ngControl instanceof FormControlDirective ||
        ngControl instanceof FormControlName ||
        ngControl instanceof NgModel)
    ) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl = ngControl;
      this.ngControl.valueAccessor = this;
    }
  }

  private setupValidator() {
    if (this.validate && this.ngControl) {
      this.validator = this.validate.bind(this);
      this.ngControl.control.addValidators(this.validator);
      this.ngControl.control.updateValueAndValidity({
        emitEvent: false,
        onlySelf: true,
      });
    }
  }

  private monitorFocus() {
    this.focusMonitor$ = this.focusMonitor.monitor(this.hostEl, true).pipe(
      tap((origin) => {
        this._focused = !!origin;
      })
    );

    this.subscribeTo(this.focusMonitor$);
  }

  /**
   * Syncs touched and dirty states between inner controls and the forwarded ngControl
   * @param innerControls controls that need to be synced
   */
  private syncOuterAndInnerControls() {
    // The ngControl.control and ngControl.statusChanges used by
    // the following methods are resolved on the next tick. So this function is
    // called from withing the Promise.resolve().
    if (this.ngControl && this.viewModel) {
      syncOuterAndInnerControls(
        this.ngControl,
        [this.viewModel],
        this.changeDetectorRef,
        this.destroy$
      );
    }
  }
}
