## 3.0.3 (2025-02-07)


### 🚀 Features

- ⚠️  **ng-superclass:** 🔥 improve FormComponentSuperclass ([#13](https://github.com/DmitryEfimenko/ngspot/pull/13))

- **ngspot:** 🔥 update repo to ng17 ([895f811](https://github.com/DmitryEfimenko/ngspot/commit/895f811))

- **expandable-input:** 🔥 angular v >15 compat ([#17](https://github.com/DmitryEfimenko/ngspot/pull/17))


### 🩹 Fixes

- peer deps ([0fd9d5d](https://github.com/DmitryEfimenko/ngspot/commit/0fd9d5d))

- **expandable-input:** 🐞 apply display none when collapsed ([37c5bf1](https://github.com/DmitryEfimenko/ngspot/commit/37c5bf1))


#### ⚠️  Breaking Changes

- **ng-superclass:** 🧨

### 3.0.2 (2024-11-12)

### Bug Fixes


### [3.0.1](https://github.com/DmitryEfimenko/ngspot/compare/expandable-input-3.0.0...expandable-input-3.0.1) (2023-08-06)

### Bug Fixes

- **expandable-input:** 🐞 apply display none when collapsed ([37c5bf1](https://github.com/DmitryEfimenko/ngspot/commit/37c5bf1667bd8830add8d12772644f2c1ac2a8cc))

## [3.0.0](https://github.com/DmitryEfimenko/ngspot/compare/expandable-input-2.0.0...expandable-input-3.0.0) (2023-01-10)

### ⚠ BREAKING CHANGES

- **expandable-input:** 🧨 animation gap is replaced with animation animateCssProperty

### Features

- **expandable-input:** 🔥 improve extensibility story ([a4f8113](https://github.com/DmitryEfimenko/ngspot/commit/a4f8113256ff909fa859d41ce98dda494c0ff337))

## [2.0.0](https://github.com/DmitryEfimenko/ngspot/compare/expandable-input-1.0.0...expandable-input-2.0.0) (2023-01-04)

### ⚠ BREAKING CHANGES

- **expandable-input:** 🧨 Switch to structural directives for input and icon selectors.
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

- **expandable-input:** 🔥 improve extensibility ([ae42b26](https://github.com/DmitryEfimenko/ngspot/commit/ae42b260e5ce67cfbe6bb5e90828486c138d1d98))

### [1.0.1](https://github.com/DmitryEfimenko/ngspot/compare/expandable-input-1.0.0...expandable-input-1.0.1) (2023-01-03)

## 1.0.0 (2022-12-28)

### Features

- **expandable-input:** 🔥 version 1.0 ([4239c17](https://github.com/DmitryEfimenko/ngspot/commit/4239c170363ac022b727872cd9118d6e47850087))
