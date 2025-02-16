<p align="center">
 <img width="20%" height="20%" src="https://github.com/DmitryEfimenko/ngspot/blob/main/packages/ngx-errors/package/assets/logo.png?raw=true">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

> Reactive forms validation for pros

Angular Material inputs have [their own way](https://material.angular.io/components/input/overview#changing-when-error-messages-are-shown) of setting logic for determining if the input needs to be highlighted red or not. If custom behavior is needed, a developer needs to provide appropriate configuration. @ngspot/ngx-errors configures this functionality for the developer under the hood. Use package `@ngspot/ngx-errors-material` for this configuration to integrate with @angular/material inputs smoothly.

This package is expected to be installed together with the package `@ngspot/ngx-errors` when using `@angular/material` inputs.

## Installation

`npm install @ngspot/ngx-errors-material`

## Usage
Import library into application module:

```ts
import { NGX_ERRORS_MATERIAL_DECLARATIONS } from '@ngspot/ngx-errors-material'; // <-- import the declarations

@Component({
  selector: 'my-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    ...NGX_ERRORS_MATERIAL_DECLARATIONS, // <-- include imported declarations
  ],
  template: `
    <form [formGroup]="form">
      <mat-form-field>
        <mat-label>Name</mat-label>

        <input matInput formControlName="name" />

        <!-- 
          Note: there's no parent ngxErrors directive.
          mat-form-field serves the purpose ngxErrors directive.
        -->
        <mat-error *ngxError="'required'">Name is required</mat-error>
      </mat-form-field>
    </form>
  `
})
export class MyComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required] }),
  });
}
```

[Optional] Provide errors configuration at the application level or at a component level:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideNgxErrorsConfig({
      // optional configuration object
      showErrorsWhenInput: 'dirty',
      showMaxErrors: 1,
    })
  ]
}).catch((err) =>
  console.error(err)
);
```
