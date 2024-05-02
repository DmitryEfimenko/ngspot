/* eslint-disable @angular-eslint/directive-selector */
import {
  AfterViewInit,
  Directive,
  Input,
  Optional,
  SkipSelf,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormGroupName,
} from '@angular/forms';

import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  filter,
  tap,
} from 'rxjs/operators';

import { ErrorsConfiguration } from './errors-configuration';
import { NgxErrorsFormDirective } from './form.directive';
import { filterOutNullish } from './misc';
import {
  ControlInstanceError,
  ControlNotFoundError,
  NoControlError,
  ParentFormGroupNotFoundError,
} from './ngx-errors';

/**
 * Directive to hook into the errors of a given control.
 *
 * Example:
 *
 * ```ts
 * \@Component({
 *   template: `
 *   <div [ngxErrors]="myControl">
 *     <div ngxError="required">This input is required</div>
 *   </div>
 *   `
 * })
 * export class MyComponent {
 *   myControl = new FormControl('', Validators.required)
 * }
 * ```
 * In case the `ngxErrors` directive is a child of a [formGroup], you can specify
 * the control by the control name similarly how you'd do it with formControlName:
 *
 * ```ts
 * \@Component({
 *   template: `
 *   <form [formGroup]="form">
 *     <div ngxErrors="firstName">
 *       <div ngxError="required">This input is required</div>
 *     </div>
 *   </form>
 *   `
 * })
 * export class MyComponent {
 *   form = this.fb.group({
 *     firstName: ['', Validators.required]
 *   });
 *   constructor(private fb: FormBuilder) {}
 * }
 * ```
 */
@Directive({
  selector: '[ngxErrors]',
  exportAs: 'ngxErrors',
})
export class ErrorsDirective implements AfterViewInit, OnDestroy {
  private subs = new Subscription();

  private control$$ = new BehaviorSubject<AbstractControl | undefined>(
    undefined
  );
  control$ = this.control$$.asObservable().pipe(filterOutNullish());

  private _controlInput$ = new BehaviorSubject<
    AbstractControl | string | undefined
  >(undefined);
  private afterViewInit$ = new BehaviorSubject(false);

  @Input('ngxErrors')
  set _control(val: AbstractControl | string | undefined) {
    if (val != null) {
      this._controlInput$.next(val);
    }
  }

  @Input() showWhen: string;

  private errorsCouldBeHidden$$ = new BehaviorSubject<Record<string, boolean>>(
    {}
  );

  private errorsVisibility$ = this.errorsCouldBeHidden$$.asObservable().pipe(
    map((errorsCouldBeHidden) => {
      const arr = [];
      let visibleCount = 0;
      for (const key in errorsCouldBeHidden) {
        if (Object.prototype.hasOwnProperty.call(errorsCouldBeHidden, key)) {
          const errorCouldBeHidden = errorsCouldBeHidden[key];
          if (!errorCouldBeHidden) {
            visibleCount++;
          }

          const visible =
            !errorCouldBeHidden &&
            (!this.config.showMaxErrors ||
              visibleCount <= this.config.showMaxErrors);

          arr.push({ key, hidden: !visible });
        }
      }
      return arr;
    }),
    shareReplay(1)
  );

  constructor(
    @Optional()
    @SkipSelf()
    public formDirective: NgxErrorsFormDirective | null,
    @Optional()
    @SkipSelf()
    public parentFormGroupDirective: FormGroupDirective | null,
    @Optional()
    @SkipSelf()
    private parentFormGroupName: FormGroupName | null,
    private config: ErrorsConfiguration
  ) {
    // initialize directive only after control input was set AND after
    // afterViewInit since parentFormGroupDirective might not be resolved
    // before that
    const $ = combineLatest(
      this._controlInput$.pipe(filterOutNullish()),
      this.afterViewInit$.pipe(filter((hasInit) => hasInit === true))
    ).pipe(
      tap(([control]) => {
        this.initDirective(control);
      })
    );

    this.subs.add($.subscribe());
  }

  ngAfterViewInit() {
    this.afterViewInit$.next(true);

    // Use of the setTimeout to ensure that the @Input _control was surely set
    // in the all cases. In particular the edge-case where ngModelGroup
    // declared via template driven forms results in the control being
    // set later than ngAfterViewInit life-cycle hook is called
    setTimeout(() => {
      this.validateDirective();
    }, 0);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  visibilityForKey$(key: string) {
    return this.errorsVisibility$.pipe(
      map((errors) => errors.find((error) => error.key === key)),
      filterOutNullish(),
      map((error) => error.hidden),
      distinctUntilChanged()
    );
  }

  visibilityChanged(errorName: string, showWhen: string, hidden: boolean) {
    const key = `${errorName}-${showWhen}`;
    const val = this.errorsCouldBeHidden$$.getValue();
    if (val[key] !== hidden) {
      const newVal = { ...val, [key]: hidden };
      this.errorsCouldBeHidden$$.next(newVal);
    }
  }

  private validateDirective() {
    if (!this._controlInput$.value) {
      throw new NoControlError();
    }
  }

  private initDirective(_control: AbstractControl | string) {
    if (typeof _control === 'string') {
      if (!this.parentFormGroupDirective) {
        throw new ParentFormGroupNotFoundError(_control);
      }

      const control = !this.parentFormGroupName
        ? this.parentFormGroupDirective.form.get(_control)
        : this.parentFormGroupName.control.get(_control);

      if (control == null) {
        throw new ControlNotFoundError(_control);
      }

      this.control$$.next(control);
      return;
    }

    if (!this.isAbstractControl(_control)) {
      throw new ControlInstanceError();
    }

    this.control$$.next(_control);
  }

  private isAbstractControl(
    control: AbstractControl | string
  ): control is AbstractControl {
    return (
      control instanceof FormControl ||
      control instanceof FormArray ||
      control instanceof FormGroup
    );
  }
}
