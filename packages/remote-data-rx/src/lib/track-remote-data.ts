import {
  errorState,
  loadingState,
  RemoteData,
  successState,
} from '@ngspot/remote-data';
import { Observable, of, UnaryFunction } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { deferredStartWith } from './deferredStartWith';
import { TrackRemoteDataOpts } from './model';

/**
 * Returns an observable of RemoteData
 * @usageNotes
 * ```ts
 * const remoteData$ = http.get('/api/data').pipe(trackRemoteData());
 * ```
 */
export function trackRemoteData<T, E = Error>(
  opts?: TrackRemoteDataOpts<T, E>
): UnaryFunction<Observable<T>, Observable<RemoteData<T, E>>> {
  return (source$: Observable<T>) => {
    const s$ = source$.pipe(
      tap((res) => {
        if (opts?.keepPreviousValue) {
          opts.keepPreviousValue.cache = res;
        }
      }),
      map((res) => successState<T>(res)),
      deferredStartWith(() => {
        return loadingState<T>(
          opts?.keepPreviousValue ? opts.keepPreviousValue.cache : undefined
        );
      }),
      catchError((err: any) => of(errorState<any, T>(err)))
    );

    const subject = opts?.subject;

    if (subject == null) {
      return s$;
    }

    return s$.pipe(
      tap({
        next: (val) => subject.next(val),
        error: (error) => subject.next(error),
      })
    );
  };
}
