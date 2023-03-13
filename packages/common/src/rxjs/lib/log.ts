import { Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Utility operator to ease debugging of observables.
 *
 * Example of usage:
 * ```
 * obs$.pipe(log('users'))
 * ```
 * @param info optional data. Usually helps to identify the logged stream
 */
export function log$<T>(
  info?: unknown,
  predicateFn?: (data?: T) => any
): UnaryFunction<Observable<T | null | undefined>, Observable<T>> {
  const stacktrace = getStackTrace();
  const caller = stacktrace[2];

  function log(event: string, data?: T) {
    const args: unknown[] = [event];
    if (info) {
      args.unshift(info);
    }
    if (!event.includes('tap.complete')) {
      const toLog = predicateFn ? predicateFn(data) : data;
      args.push(toLog);
    }
    // eslint-disable-next-line no-console
    console.log(...args);
  }
  return pipe(
    tap<T>(
      (x) => {
        log(`[${caller}] tap.next`, x);
      },
      (x) => {
        log(`[${caller}] tap.error`, x);
      },
      () => {
        log(`[${caller}] tap.complete`);
      }
    ) as OperatorFunction<T | null | undefined, T>
  );
}

function getStackTrace() {
  const obj = {} as { stack: string };
  Error.captureStackTrace(obj, getStackTrace);
  return obj.stack
    .split('\n')
    .map((s) => {
      let text = s.trim();
      const openParenIx = text.indexOf(' (');
      if (openParenIx > -1) {
        text = text.substring(0, openParenIx);
      }
      if (text.includes('http://localhost')) {
        text = '';
      }
      return text;
    })
    .filter((x) => !!x);
}
