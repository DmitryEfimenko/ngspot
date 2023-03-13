import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FormComponentSuperclass } from '../form-component-superclass';

type OuterType = string | undefined;
type InnerType = {
  firstName: string;
  lastName: string;
};

@Component({
  selector: 'ngs-full-name',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="viewModel">
      <input
        formControlName="firstName"
        name="firstName"
        placeholder="First name"
      />
      &nbsp;
      <input
        formControlName="lastName"
        name="lastName"
        placeholder="Last name"
      />
    </form>
  `,
})
export class FullNameReactiveComponent extends FormComponentSuperclass<
  OuterType,
  InnerType
> {
  override viewModel = new FormGroup(
    {
      firstName: new FormControl('', { nonNullable: true }),
      lastName: new FormControl('', { nonNullable: true }),
    },
    { validators: FirstAndLastNameValidator() }
  );

  override outerToInner = (fullName$: Observable<OuterType>) =>
    fullName$.pipe(
      map((fullName) => {
        const [firstName, lastName] = (fullName ?? '').split(' ');
        const inner: InnerType = {
          firstName: firstName ?? '',
          lastName: lastName ?? '',
        };
        return inner;
      })
    );

  override innerToOuter = (innerValues$: Observable<InnerType>) =>
    innerValues$.pipe(
      map(({ firstName, lastName }) => {
        let result = '';
        if (firstName) {
          result += firstName;
        }
        if (lastName) {
          result += ` ${lastName}`;
        }
        return result;
      })
    );

  override validate(control: AbstractControl<OuterType>) {
    if (!control.value) {
      return null;
    }
    return this.viewModel.errors;
  }
}

const allowedNames: InnerType[] = [
  { firstName: 'Bob', lastName: 'Swagger' },
  { firstName: 'Jack', lastName: 'Reacher' },
];

function FirstAndLastNameValidator(): ValidatorFn {
  return (control: AbstractControl<InnerType>) => {
    const error = isFirstAndLastNameValid(control.value)
      ? null
      : {
          notAllowedName: {
            actual: control.value,
            allowed: allowedNames,
          },
        };
    return error;
  };
}

function isFirstAndLastNameValid({ firstName, lastName }: InnerType): boolean {
  return allowedNames.some(
    (allowed) =>
      allowed.firstName === firstName && allowed.lastName === lastName
  );
}
