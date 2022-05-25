import { Directive, Injector, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { merge, Observable, of, Subject } from 'rxjs';
import { shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { FormComponentSuperclass } from './form-component-superclass';
import { syncOuterAndInnerControls } from './sync-controls/sync-outer-and-inner-controls';

/**
 * Extend this when creating a form component that simply wraps existing ones, to reduce a lot of boilerplate. **Warning:** You _must_ include a constructor in your subclass.
 *
 *
 * Example of wrapping multiple inner components:
 * ```ts
 * class FullName {
 *   firstName = '';
 *   lastName = '';
 * }
 *
 * @Component({
 *   selector: 'app-full-name',
 *   template: `
 *     <div [formGroup]="control">
 *       <input id="first" formControlName="firstName" />
 *       <input id="last" formControlName="lastName" />
 *     </div>
 *   `,
 * })
 * class FullNameComponent extends WrappedControlSuperclass<FullName> {
 *   control = new FormGroup({
 *     firstName: new FormControl(),
 *     lastName: new FormControl(),
 *   });
 *
 *   override outerToInner(outer$: Observable<FullName | null>): Observable<FullName> {
 *     // `outer` can come in as `null` during initialization when the user binds with `ngModel`
 *     return outer$.pipe(map(value) => (value ?? new FullName()));
 *   }
 * }
 * ```
 *
 * Example when you need to modify the wrapped control's value:
 * ```ts
 * @Component({
 *   template: `<input type="datetime-local" [control]="formControl">`,
 * })
 * class DateComponent extends WrappedFormControlSuperclass<Date, string> {
 *   override innerToOuter(inner$: Observable<string>): Observable<Date> {
 *     return inner$.pipe(
 *       map((value) => { return new Date(value + 'Z') })
 *     );
 *   }
 *
 *   override outerToInner(outer$: Observable<Date>): Observable<string> {
 *     return outer$.pipe(map((value) => {
 *       if (value == null) {
 *         return ''; // happens during initialization
 *       }
 *       return value.toISOString().substr(0, 16);
 *     }));
 *   }
 * }
 * ```
 */
@Directive()
export abstract class WrappedControlSuperclass<OuterType, InnerType = OuterType>
  extends FormComponentSuperclass<OuterType>
  implements OnInit
{
  /** Bind this to your inner form control to make all the magic happen. */
  abstract control: AbstractControl;

  private incomingValues$$ = new Subject<OuterType>();

  /**
   * Stream of values that are set on the outer control
   */
  incomingValues$ = this.incomingValues$$.asObservable();

  innerControlValues$: Observable<InnerType> | undefined;

  /**
   * Stream that takes all incoming values, optionally applies user-provided
   * transformation, and commits the value to the inner form control
   */
  private outerToInner$ = this.incomingValues$.pipe(
    (s) => this.outerToInner(s),
    tap((value) => this.control.setValue(value, { emitEvent: false })),
    shareReplay(1)
  );

  /**
   * Stream that listens to values as user types in the input, optionally applies
   * user-provided transformation, and emits the result to the outer form control
   */
  private innerToOuter$ = of(null).pipe(
    switchMap(() => this.control.valueChanges),
    (s) => this.innerToOuter(s),
    tap((value) => this.emitOutgoingValue(value)),
    shareReplay(1)
  );

  latestValue$ = merge(
    of<null>(null),
    this.incomingValues$,
    this.innerToOuter$
  );

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    if (!this.control) {
      throw new Error('Initialize property control in your subclass');
    }

    // TODO: find a way to move it to constructor to remove the "| undefined"
    this.innerControlValues$ = this.control.valueChanges.pipe(
      startWith(this.control.value)
    );

    this.subscribeTo(this.outerToInner$);
    this.subscribeTo(this.innerToOuter$);

    this.syncOuterAndInnerControls();
  }

  /** Called as angular propagates values changes to this `ControlValueAccessor`. You normally do not need to use it. */
  handleIncomingValue(outer: OuterType): void {
    this.incomingValues$$.next(outer);
  }

  /** Called as angular propagates disabled changes to this `ControlValueAccessor`. You normally do not need to use it. */
  override setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
    super.setDisabledState(this.isDisabled);
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
  protected outerToInner(
    values$: Observable<OuterType>
  ): Observable<InnerType> {
    return values$ as unknown as Observable<InnerType>;
  }

  /**
   * Override this to modify a value coming from within this component to the format expected on the outside.
   * Example:
   * ```ts
   * return values$.pipe(map(val => parseInt(val)));
   * ```
   * @param values$ Stream of inner formControl.valueChanges
   * @returns Stream of transformed values that conform to the type of outer control
   */
  protected innerToOuter(
    values$: Observable<InnerType>
  ): Observable<OuterType> {
    return values$ as unknown as Observable<OuterType>;
  }

  private syncOuterAndInnerControls() {
    // The ngControl.control and ngControl.statusChanges used by
    // the following methods are resolved on the next tick
    setTimeout(() => {
      if (this.ngControl) {
        syncOuterAndInnerControls(
          this.ngControl,
          [this.control],
          this.changeDetectorRef,
          this.destroy$
        );
      }
    }, 0);
  }
}
