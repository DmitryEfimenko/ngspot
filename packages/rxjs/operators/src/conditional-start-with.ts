import { defer, Observable, OperatorFunction } from 'rxjs';
import { startWith } from 'rxjs/operators';

export function conditionalStartWith<T>(
  condition: () => boolean,
  cb: () => T
): OperatorFunction<unknown, T> {
  return function (source: Observable<any>) {
    return defer(() => {
      return condition() ? source.pipe(startWith(cb())) : source;
    });
  };
}
