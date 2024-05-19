# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [4.0.1-rc.0](https://github.com/DmitryEfimenko/ngspot/compare/ngx-errors-material-4.0.0...ngx-errors-material-4.0.1-rc.0) (2024-05-19)


### Bug Fixes

* 🐞 re-exports from ngx-errors don't work ([055dc11](https://github.com/DmitryEfimenko/ngspot/commit/055dc112ea11e8c8e652ef8b4f6a682910c131e5))

## [4.0.0](https://github.com/DmitryEfimenko/ngspot/compare/ngx-errors-material-3.0.0...ngx-errors-material-4.0.0) (2024-05-16)


### ⚠ BREAKING CHANGES

* Requires Angular >17.1 and @ngspot/ngx-errors ^4.0.0
* Removed NgxErrorsMaterialModule. Use NGX_ERRORS_MATERIAL_DECLARATIONS instead

### Features

* 🔥 ng 17.1 compat ([c5ee590](https://github.com/DmitryEfimenko/ngspot/commit/c5ee59068d8453eaa019bab7e4071dfb110b7bb3))
* `ngxErrors` directive is not needed when `*ngxError` directive is used inside of the `<mat-form-field>`
