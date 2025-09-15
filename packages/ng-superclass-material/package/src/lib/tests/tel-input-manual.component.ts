/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-empty-function */
import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';

import { Subject } from 'rxjs';

import { MyTel } from './tel-input.model';

@Component({
  selector: 'ngs-tel-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div
      role="group"
      class="example-tel-input-container"
      [formGroup]="parts"
      [attr.aria-labelledby]="_formField.getLabelId()"
      (focusin)="onFocusIn($event)"
      (focusout)="onFocusOut($event)"
    >
      <input
        #area
        class="example-tel-input-element"
        formControlName="area"
        size="3"
        maxLength="3"
        aria-label="Area code"
        (input)="_handleInput(parts.controls.area, exchange)"
      />
      <span class="example-tel-input-spacer">&ndash;</span>
      <input
        #exchange
        class="example-tel-input-element"
        formControlName="exchange"
        maxLength="3"
        size="3"
        aria-label="Exchange code"
        (input)="_handleInput(parts.controls.exchange, subscriber)"
        (keyup.backspace)="autoFocusPrev(parts.controls.exchange, area)"
      />
      <span class="example-tel-input-spacer">&ndash;</span>
      <input
        #subscriber
        class="example-tel-input-element"
        formControlName="subscriber"
        maxLength="4"
        size="4"
        aria-label="Subscriber number"
        (input)="_handleInput(parts.controls.subscriber)"
        (keyup.backspace)="autoFocusPrev(parts.controls.subscriber, exchange)"
      />
    </div>
  `,
  styleUrls: ['./tel-input.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: MyTelInputComponent },
  ],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
})
export class MyTelInputComponent
  implements ControlValueAccessor, MatFormFieldControl<MyTel>, OnDestroy
{
  static nextId = 0;

  @ViewChild('area') areaInput: HTMLInputElement;
  @ViewChild('exchange') exchangeInput: HTMLInputElement;
  @ViewChild('subscriber') subscriberInput: HTMLInputElement;

  parts = this._formBuilder.group({
    area: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
    ],
    exchange: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
    ],
    subscriber: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
    ],
  });
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'example-tel-input';
  id = `example-tel-input-${MyTelInputComponent.nextId++}`;
  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {
      value: { area, exchange, subscriber },
    } = this.parts;

    return !area && !exchange && !subscriber;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input('aria-describedby') userAriaDescribedBy: string;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): MyTel | null {
    if (this.parts.valid) {
      const {
        value: { area, exchange, subscriber },
      } = this.parts;
      return new MyTel(area!, exchange!, subscriber!);
    }
    return null;
  }
  set value(tel: MyTel | null) {
    const { area, exchange, subscriber } = tel || new MyTel('', '', '');
    this.parts.setValue({ area, exchange, subscriber });
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this.parts.invalid && this.touched;
  }

  private _formBuilder = inject(FormBuilder);
  private _focusMonitor = inject(FocusMonitor);

  private _elementRef = inject(ElementRef<HTMLElement>);

  public _formField = inject(MatFormField, { optional: true, self: false });
  public ngControl = inject(NgControl, { optional: true, self: true });

  constructor() {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  onFocusIn(_event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (
      !this._elementRef.nativeElement.contains(event.relatedTarget as Element)
    ) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  autoFocusNext(
    control: AbstractControl,
    nextElement?: HTMLInputElement,
  ): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement.querySelector(
      '.example-tel-input-container',
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    if (this.parts.controls.subscriber.valid) {
      this._focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.parts.controls.exchange.valid) {
      this._focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.parts.controls.area.valid) {
      this._focusMonitor.focusVia(this.exchangeInput, 'program');
    } else {
      this._focusMonitor.focusVia(this.areaInput, 'program');
    }
  }

  writeValue(tel: MyTel | null): void {
    this.value = tel;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }
}
