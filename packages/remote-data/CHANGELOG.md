## 1.3.0 (2026-03-14)

### 🚀 Features

- **remote-data:** 🔥 support cjs and esm ([9341267](https://github.com/DmitryEfimenko/ngspot/commit/9341267))
- bump deps and adapt code to angular 20 ([#23](https://github.com/DmitryEfimenko/ngspot/pull/23))
- **ngspot:** 🔥 update repo to ng17 ([895f811](https://github.com/DmitryEfimenko/ngspot/commit/895f811))
- ⚠️  **ng-superclass:** 🔥 improve FormComponentSuperclass ([#13](https://github.com/DmitryEfimenko/ngspot/pull/13))
- **expandable-input:** 🔥 version 1.0 ([#5](https://github.com/DmitryEfimenko/ngspot/pull/5))

### 🩹 Fixes

- **demo:** 🐞 incorrect baseHref in table of contents ([aba3844](https://github.com/DmitryEfimenko/ngspot/commit/aba3844))

### ⚠️  Breaking Changes

- **ng-superclass:** 🔥 improve FormComponentSuperclass  ([#13](https://github.com/DmitryEfimenko/ngspot/pull/13))
  🧨
  * Removed `WrappedFormControlSuperclass` and `WrappedFormControlSuperclass`.
  * Changes in `FormComponentSuperclass`:
    * `emitOutgoingValue` method is now private. To sync the inner state to the outer, use `this.viewModel.setValue()` method. For more info, see README.md

### [1.2.1](https://github.com/DmitryEfimenko/ngspot/compare/remote-data-1.2.0...remote-data-1.2.1) (2022-06-22)


### Bug Fixes

* **remote-data:** 🐞 correct types for guards ([4762843](https://github.com/DmitryEfimenko/ngspot/commit/4762843ef7ced814888f42871d9ac633916b1e44))

## [1.2.0](https://github.com/DmitryEfimenko/ngspot/compare/remote-data-1.1.0...remote-data-1.2.0) (2022-06-15)


### Features

* **remote-data:** 🔥 allow value for notAsked state ([d790035](https://github.com/DmitryEfimenko/ngspot/commit/d7900357010d66075a024b1d9bc207a2ddb44a67))

## [1.1.0](https://github.com/DmitryEfimenko/ngspot/compare/remote-data-1.0.1...remote-data-1.1.0) (2022-05-25)

### Features

- **remote-data:** 🔥 make value not optional for success state ([011900e](https://github.com/DmitryEfimenko/ngspot/commit/011900ecd8a24f065d134a5170eff099c4cdba87))

### Bug Fixes

- **remote-data:** 🐞 compile to esnext ([614c85e](https://github.com/DmitryEfimenko/ngspot/commit/614c85e05ec6510f0fe209ce0477010728a8dd72))
