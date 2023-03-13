import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormControl, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
        [(ngModel)]="viewModel.value.val1"
        (ngModelChange)="inputUpdated()"
        (blur)="onTouched()"
        name="inp1"
      />
      <input
        [(ngModel)]="viewModel.value.val2"
        (ngModelChange)="inputUpdated()"
        (blur)="onTouched()"
        name="inp2"
      />
    </div>
  `,
})
export class TwoInputsTemplateDrivenComponent extends FormComponentSuperclass<
  OuterType,
  InnerType
> {
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
        return inner;
      })
    );

  override innerToOuter = (innerValues$: Observable<InnerType>) =>
    innerValues$.pipe(map((inner) => inner.val1 + inner.val2));

  override validate(control: AbstractControl) {
    if (control.value?.length < 3) {
      return { minLength: 3 };
    }
    return null;
  }

  inputUpdated() {
    this.viewModel.setValue(this.viewModel.value);
    this.onTouched();
  }
}
