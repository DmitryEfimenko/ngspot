# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

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
