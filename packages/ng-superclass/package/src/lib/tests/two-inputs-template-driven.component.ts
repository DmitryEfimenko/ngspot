import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  NgModel,
} from '@angular/forms';

import { merge, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { FormComponentSuperclass } from '../form-component-superclass';

type OuterType = string | null;
type InnerType = {
  val1: string;
  val2: string;
};

@Component({
  selector: 'ngs-two-inputs',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <input
        #input1="ngModel"
        name="inp1"
        (blur)="onTouched()"
        (keyup)="updateViewModel()"
        [(ngModel)]="val1"
      />
      <input
        #input2="ngModel"
        name="inp2"
        (blur)="onTouched()"
        (keyup)="updateViewModel()"
        [(ngModel)]="val2"
      />
    </div>
  `,
})
export class TwoInputsTemplateDrivenComponent extends FormComponentSuperclass<
  OuterType,
  InnerType
> {
  @ViewChild('input1') input1: NgModel;
  @ViewChild('input2') input2: NgModel;

  val1 = '';
  val2 = '';

  override viewModel = new FormControl<InnerType>(
    { val1: '', val2: '' },
    { nonNullable: true }
  );

  override outerToInner = (outerValues$: Observable<OuterType>) =>
    outerValues$.pipe(
      map((outer) => {
        const inner: InnerType = {
          val1: outer?.substring(0, 3) ?? '',
          val2: outer?.substring(3, outer.length) ?? '',
        };
        this.val1 = inner.val1;
        this.val2 = inner.val2;
        return inner;
      })
    );

  override innerToOuter = (innerValues$: Observable<InnerType>) =>
    innerValues$.pipe(
      map((inner) => {
        return inner.val1 + inner.val2;
      })
    );

  override validate(control: AbstractControl) {
    if (control.value?.length < 3) {
      return { minLength: 3 };
    }
    return null;
  }

  updateViewModel() {
    this.viewModel.setValue({
      val1: this.input1.control.value,
      val2: this.input2.control.value,
    });
  }
}
