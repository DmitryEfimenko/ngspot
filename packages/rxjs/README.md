# @ngspot/rxjs

A library providing a few useful RxJS operators.

## Installation

### NPM

```sh
npm install @ngspot/rxjs
```

### Yarn

```sh
yarn add @ngspot/rxjs
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

### Usage

```ts
import { filterOutNullish } from '@ngspot/rxjs/operators';

myObservable$.pipe(filterOutNullish());
```

## Decorators


### @Share()

This decorator comes handy when you expect a function that returns a completable observable to share that observable for a unique set of parameters of the function.

In the example below only 2 http network requests will be made.

```ts
import { Share } from '@ngspot/rxjs/decorators';

class MyApi {
  constructor(private http: HttpClient) {}

  @Share()
  makeCall(param1: number, param2: number) {
    return this.http.get(`/api/${param1}/${param2}`);
  }
}

class BusinessLogic {
  constructor(private api: MyApi) {
    api.makeCall(1, 2).subscribe();
    api.makeCall(1, 2).subscribe();
    api.makeCall(1, 3).subscribe();
  }
}
```

There might be a use-case when you'd want to disable the functionality of `@Share` decorator based on the function arguments.
To achieve this you can provide the `when` option to specify the condition when the observable should be shared:

In the example below the observable will only be shared when the `param1` is not equal to `param2`.

```ts
@Share({ when: (param1, param2) => param1 !== param2 })
makeCall(param1: number, param2: number) {
  return this.http.get(`/api/${param1}/${param2}`);
}
```
The context of the `when` callback function is the context of the class instance. The signature of the of `when` callback has the same signature as the method that the decorator is applied to.

With the implementation above, two HTTP requests will be made in the example below:
```ts
class BusinessLogic {
  constructor(private api: MyApi) {
    api.makeCall(1, 1).subscribe();
    api.makeCall(1, 1).subscribe();
  }
}
```

## License

MIT © [Dmitry Efimenko](mailto:dmitrief@gmail.com)
