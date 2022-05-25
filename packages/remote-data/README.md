# RemoteData

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> A library for tracking status of Remote Data with loading and error information.

## Features

- ✅ Simple syntax that reduces boilerplate
- ✅ Configurable for many scenarios
- ✅ Compatible with any framework

# Additional functionality

**[@ngspot/remote-data-rx](https://www.npmjs.com/package/@ngspot/remote-data-rx)**

- for easy integration of RemoteData tracking with RxJS streams

## Installation

### NPM

```sh
npm install @ngspot/remote-data
```

### Yarn

```sh
yarn add @ngspot/remote-data
```

## The RemoteData data structure

At the core of the pattern is an object that lets developers track the current state of the data. The data could be in one of the four mutually exclusive states:

- Not asked
- Loading
- Success
- Error

These states are represented by the following object:

```ts
interface RemoteData<T, E> {
  state: 'notAsked' | 'loading' | 'success' | 'error';
  isLoading: boolean;
  value?: T;
  error?: E;
}
```

The RemoteData data structure is flexible enough to accommodate two scenarios:

- when the UI displays completely separate components during the different states
- when the UI does not remove the previously loaded data during the loading state

## The RemoteData builders

This library provides builder functions that let the developer easily set one of the desired states of the data:

```js
// [optionally] set the data state to "not asked"
let data = notAskedState();

function userClickHandler() {
  // set the data state tp "loading"
  data = loadingState();

  api.loadDataPromise()
    .then((response) => {
      // set the data state tp "success"
      data = successState(response);
    })
    .catch(error) => {
      // set the data state tp "error"
      data = errorState(error);
    }
}
```

## Rendering data using RemoteData

The `RemoteData` structure is convenient to use when rendering items in the template.
Here's one example of usage:

#### Angular

```html
<!-- Show a spinner if state is loading -->
<my-loading-spinner *ngIf="data.state === 'loading'"></my-loading-spinner>

<!-- Show the data if state is loaded -->
<my-data-view
  *ngIf="data.state === 'success'"
  [data]="data.value"
></my-data-view>

<!-- Show an error message if state is error -->
<my-error-view
  *ngIf="data.state === 'error'"
  [error]="data.error"
></my-error-view>
```

#### React

```jsx
return (
  <>
    // Show a spinner if state is loading
    {data.state === 'loading' && <my-loading-spinner></my-loading-spinner>}
    // Show the data if state is loaded
    {data.state === 'success' && (
      <my-data-view data={data.value}></my-data-view>
    )}
    // Show an error message if state is error
    {data.state === 'error' && (
      <my-error-view error={data.error}></my-error-view>
    )}
  </>
);
```

## RemoteData guards

For convenience, the library provides type guard functions to the asset current state:

```ts
function isNotAskedState(data: RemoteData): data is NotAskedState;
function isLoadingState<T>(data: RemoteData<T>): data is LoadingState<T>;
function isSuccessState<T>(data: RemoteData<T>): data is SuccessState<T>;
function isErrorState<T, E>(data: RemoteData<T, E>): data is ErrorState<T, E>;
```

## Previous Art

The library is heavily inspired by:

- Kris Jenkins' blog post about [How Elm slays a UI antipattern](http://blog.jenkster.com/2016/06/how-elm-slays-a-ui-antipattern.html)
- https://github.com/joanllenas/ngx-remotedata
- https://github.com/daiscog/ngx-http-request-state

## License

MIT © [Dmitry Efimenko](mailto:dmitrief@gmail.com)
