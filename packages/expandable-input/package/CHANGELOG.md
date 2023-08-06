# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

### [3.0.1](https://github.com/DmitryEfimenko/ngspot/compare/expandable-input-3.0.0...expandable-input-3.0.1) (2023-08-06)


### ⚠ BREAKING CHANGES

* **ng-superclass:** 🧨

* Removed `WrappedFormControlSuperclass` and `WrappedFormControlSuperclass`.
* Changes in `FormComponentSuperclass`:
  * `emitOutgoingValue` method is now private. To sync the inner state to the outer, use `this.viewModel.setValue()` method. For more info, see README.md

### Features

* **ng-superclass:** 🔥 improve FormComponentSuperclass ([#13](https://github.com/DmitryEfimenko/ngspot/issues/13)) ([2d415b3](https://github.com/DmitryEfimenko/ngspot/commit/2d415b3f49f08ec3a0b126beeb61336a3dc7e611))


### Bug Fixes

* **expandable-input:** 🐞 apply display none when collapsed ([37c5bf1](https://github.com/DmitryEfimenko/ngspot/commit/37c5bf1667bd8830add8d12772644f2c1ac2a8cc))

## [3.0.0](https://github.com/DmitryEfimenko/ngspot/compare/expandable-input-2.0.0...expandable-input-3.0.0) (2023-01-10)


### ⚠ BREAKING CHANGES

* **expandable-input:** 🧨 animation gap is replaced with animation animateCssProperty

### Features

* **expandable-input:** 🔥 improve extensibility story ([a4f8113](https://github.com/DmitryEfimenko/ngspot/commit/a4f8113256ff909fa859d41ce98dda494c0ff337))

## [2.0.0](https://github.com/DmitryEfimenko/ngspot/compare/expandable-input-1.0.0...expandable-input-2.0.0) (2023-01-04)


### ⚠ BREAKING CHANGES

* **expandable-input:** 🧨 Switch to structural directives for input and icon selectors.
Before:
```html
<ngs-expandable-input>
  <input type="text" ngsExpInput />
  <i ngsExpIconOpen>🔍</i>
  <i ngsExpIconClose>✖️</i>
</ngs-expandable-input>
```
After:
```html
<ngs-expandable-input>
  <input type="text" *ngsExpInput />
  <i *ngsExpIconOpen>🔍</i>
  <i *ngsExpIconClose>✖️</i>
</ngs-expandable-input>
```

### Features

* **expandable-input:** 🔥 improve extensibility ([ae42b26](https://github.com/DmitryEfimenko/ngspot/commit/ae42b260e5ce67cfbe6bb5e90828486c138d1d98))

### [1.0.1](https://github.com/DmitryEfimenko/ngspot/compare/expandable-input-1.0.0...expandable-input-1.0.1) (2023-01-03)

## 1.0.0 (2022-12-28)

### Features

- **expandable-input:** 🔥 version 1.0 ([4239c17](https://github.com/DmitryEfimenko/ngspot/commit/4239c170363ac022b727872cd9118d6e47850087))
