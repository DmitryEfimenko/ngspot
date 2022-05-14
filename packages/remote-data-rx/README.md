# Remote Data RX

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> An RxJS extension library for tracking observables (such as HTTP requests) with loading and error information via RemoteData data structure.

## Features

- ✅ Simple syntax that reduces boilerplate
- ✅ Configurable for many scenarios
- ✅ Compatible with any framework

## Installation

### NPM

```sh
npm install @ngspot/remote-data-rx
```

### Yarn

```sh
yarn add @ngspot/remote-data-rx
```

## The RemoteData data structure

See [@ngspot/remote-data](https://www.npmjs.com/package/@ngspot/remote-data)

## `trackRemoteData` RxJS Operator

Using RemoteData state builder functions is better than composing the object by hand, but there is an even better way if using observables. Use the `trackRemoteData` operator:

```ts
import { trackRemoteData } from '@ngspot/remote-data-rx';

const data$ = api.loadMyDataObservable().pipe(trackRemoteData());
```

The resulting observable will emit an object with appropriate properties set to the correct values depending on state of the request observable.

### Configuration

In most scenarios using the `trackRemoteData()` operator is sufficient without any configuration. However, the following configuration object is available to pass in to customize behavior:

```ts
export interface TrackRemoteDataOpts<T, E = Error> {
  /**
   * A subject to which the remote data will be tracked.
   */
  subject?: Subject<RemoteData<T, E>>;

  /**
   * Whether to keep the previous value during loading.
   */
  keepPreviousValue?: PreviousValueCache<T>;
}
```

### option: "subject":

Imagine having a side-effect in the application, which is in charge of posting data to the server. In this case, there is no way to assign the result of the post to an observable. So instead, developers tell the `trackRemoteData` operator to push results into a different subject. For convenience's sake, this library provides a tiny function to generate such subject, which is a BehaviorSubject initialized with `notAskedState`. The function is called `trackingRemoteDataSubject()`.

```ts
import { trackRemoteData } from '@ngspot/remote-data-rx';

class MyComponent {
  savingState$ = trackingRemoteDataSubject<MyData>();

  saveData = this.createEffect<MyData>((data$) =>
    data$.pipe(
      mergeMap((data) =>
        this.http
          .post('/api/data', { data })
          .pipe(trackRemoteData({ subject: this.savingState$ }))
      )
    )
  );
}
```

Now developers can subscribe to the `savingState$` in the template.

Notice, that under the hood, the "complete" event is not passed into the provided subject. This way `saveData()` method can be called many times and the provided Subject won't be completed.

### option "keepPreviousValue"

By default, when the `trackRemoteData()` operator is used, it will always set `value` property of the RemoteData to `undefined` when the state is "loading". However, this may not be the desired behavior. Perhaps, instead of just displaying the loading indicator the application requires to keep the previously loaded data shown while graying the data out. The `keepPreviousValue` is exactly for this use-case.

Imagine loading data based on the change of the `userId$` observable:

```ts
import { trackRemoteData, PreviousValueCache } from '@ngspot/remote-data-rx';

class MyComponent {
  private keepPreviousValue = new PreviousValueCache();

  remoteData$ = this.userId$.pipe(
    switchMap((userId) => {
      return this.http
        .get(`/api/user/${userId}`)
        .pipe(trackRemoteData({ keepPreviousValue: this.keepPreviousValue }));
    })
  );
}
```

The `PreviousValueCache` is storage to provide so that the `trackRemoteData` operator has a place to store the previous value between each new request.

## Previous Art

The library is heavily inspired by:

- https://github.com/daiscog/ngx-http-request-state

## License

MIT © [Dmitry Efimenko](mailto:dmitrief@gmail.com)
