import { defer, Observable, OperatorFunction } from 'rxjs';
import { startWith } from 'rxjs/operators';

export function deferredStartWith<T>(
  cb: () => T,
): OperatorFunction<unknown, T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (source: Observable<any>) {
    return defer(() => {
      return source.pipe(startWith(cb()));
    });
  };
}
