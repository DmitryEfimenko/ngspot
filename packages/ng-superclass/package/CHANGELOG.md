# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

### [2.1.1](https://github.com/DmitryEfimenko/ngspot/compare/ng-superclass-2.1.0...ng-superclass-2.1.1) (2023-03-24)

## [2.1.0](https://github.com/DmitryEfimenko/ngspot/compare/ng-superclass-2.0.0...ng-superclass-2.1.0) (2023-03-22)


### Features

* **ng-superclass:** 🔥 make focusMonitor prop protected ([c0e47c7](https://github.com/DmitryEfimenko/ngspot/commit/c0e47c77474b841a053d319c6f6ddbfc614250cb))


### Bug Fixes

* **ng-superclass:** 🐞 on init vm.setValue is called twise ([8e9fd4a](https://github.com/DmitryEfimenko/ngspot/commit/8e9fd4a9be2c4708f282103916118cf4ece1c7c9))

## [2.0.0](https://github.com/DmitryEfimenko/ngspot/compare/ng-superclass-1.1.0...ng-superclass-2.0.0) (2023-03-13)

### Features

- **ng-superclass:** 🔥 improve FormComponentSuperclass ([#13](https://github.com/DmitryEfimenko/ngspot/issues/13)) ([2d415b3](https://github.com/DmitryEfimenko/ngspot/commit/2d415b3f49f08ec3a0b126beeb61336a3dc7e611))

### ⚠ BREAKING CHANGES

- **ng-superclass:** 🧨

- Removed `WrappedFormControlSuperclass` and `WrappedFormControlSuperclass`.
- Changes in `FormComponentSuperclass`:
  - `emitOutgoingValue` method is now private. To sync the inner state to the outer, use `this.viewModel.setValue()` method. For more info, see project [README.md](https://github.com/DmitryEfimenko/ngspot/blob/main/packages/ng-superclass/package/README.md)

## [1.2.0](https://github.com/DmitryEfimenko/ngspot/compare/ng-superclass-1.1.0...ng-superclass-1.2.0) (2023-01-10)

### Bug Fixes

- **ng-superclass:** 🐞 property `required` should allow for string values

## [1.1.0](https://github.com/DmitryEfimenko/ngspot/compare/ng-superclass-1.0.3...ng-superclass-1.1.0) (2022-12-29)

### Features

- **ng-superclass:** 🔥 partial compat with mat-form-field ([dbb1a34](https://github.com/DmitryEfimenko/ngspot/commit/dbb1a343eaa0089509f39e4642b5d8c21111dca2)), closes [#1](https://github.com/DmitryEfimenko/ngspot/issues/1)

### [1.0.4](https://github.com/DmitryEfimenko/ngspot/compare/ng-superclass-1.0.3...ng-superclass-1.0.4) (2022-12-08)

### Bug Fixes

- **ng-superclass:** 🐞 move observable init in constructor ([5ba11e7](https://github.com/DmitryEfimenko/ngspot/commit/5ba11e7d320892a27b49fe20ba862807b32c5be0)), closes [#1](https://github.com/DmitryEfimenko/ngspot/issues/1)

### [1.0.3](https://github.com/DmitryEfimenko/ngspot/compare/ng-superclass-1.0.2...ng-superclass-1.0.3) (2022-05-25)

### [1.0.2](https://github.com/DmitryEfimenko/ngspot/compare/ng-superclass-1.0.1...ng-superclass-1.0.2) (2022-05-25)

### Bug Fixes

- **ng-superclass:** 🐞 allow for angular v13 as peer dep ([fca998c](https://github.com/DmitryEfimenko/ngspot/commit/fca998c0ae0016c21dc62fa26e74d06d16f9b279))
