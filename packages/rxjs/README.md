# @ngspot/rxjs

A library providing a few useful RxJS operators.

## Installation

### NPM

```sh
npm install @ngspot/ng-superclass
```

### Yarn

```sh
yarn add @ngspot/ng-superclass
```

## Operators:

- `filterOutNullish` - type safe operator for filtering out nullish values
- `deferredStartWith` - the same as `startWith`, but takes the first value in a callback, which allows to evaluate it lazily
- `conditionalStartWith` - the same as `deferredStartWith`, but the first argument is a callback returning a boolean. If boolean is evaluated to true, `startWith` is applied with a result of a callback of the second argument
- `log$` - logs values passing through this operator
- `mutationObserver` - observable creator. Wraps native `MutationObserver`
- `resizeObserver` - observable creator. Wraps native `ResizeObserver`
- `zoneFull` - enters the stream into Angular Zone
- `zoneFree` - exits the stream from Angular Zone

## Usage

```ts
import { filterOutNullish } from '@ngspot/rxjs/operators';

myObservable$.pipe(filterOutNullish);
```

## License

MIT © [Dmitry Efimenko](mailto:dmitrief@gmail.com)
