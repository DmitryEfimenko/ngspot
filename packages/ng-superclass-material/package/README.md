# ng-superclass-material

This package features class `FormComponentMaterialSuperclass`. Extend from this class to make it easy to write custom form controls compatible with [Material Form Field](https://material.angular.io/components/form-field/overview).

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Installation

### NPM

```sh
npm install @ngspot/ng-superclass-material
```

### Yarn

```sh
yarn add @ngspot/ng-superclass-material
```

## Overview

Writing a custom control can be [quite a bit work](https://blog.angular-university.io/angular-custom-form-controls#demoofafullyfunctionalcustomformcontrol). Writing a custom control compatible with Material Form Field is [even more work](https://material.angular.io/guide/creating-a-custom-form-field-control).

The work associated with writing a custom control is simplified via `FormComponentSuperclass` class from [@ngspot/ng-superclass](https://www.npmjs.com/package/@ngspot/ng-superclass) package. You are welcome.

`@ngspot/ng-superclass-material` package presents a layer on top of it. It features `FormComponentMaterialSuperclass` that extends from `FormComponentSuperclass` and makes it much easier to author form components compatible with **Material Form Field**.

Take a look at the exactly the same component built by hand vs when `FormComponentMaterialSuperclass` was used:

![code comparison](https://github.com/DmitryEfimenko/ngspot/blob/main/packages/ng-superclass-material/package/assets/comparison.png?raw=true)

## Usage:

- Extend your component class from the `FormComponentMaterialSuperclass`
- Implement `MatFormFieldControl`
- Make sure to add `MatFormFieldControl` to providers
- The rest is the same as for the `FormComponentSuperclass`. See [docs here](https://github.com/DmitryEfimenko/ngspot/blob/main/packages/ng-superclass/package/README.md#formcomponentsuperclass).

```ts
@Component({
  // ...
  providers: [{ provide: MatFormFieldControl, useExisting: MyComponent }],
})
class MyComponent
  extends FormComponentMaterialSuperclass<ValueType>
  implements MatFormFieldControl<ValueType> {
  // ...
}
```

## License

MIT © [Dmitry Efimenko](mailto:dmitrief@gmail.com)
