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
- `deferredStartWith` - the same as start with, but takes the first value in a callback, which allows to evaluate it lazily
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
