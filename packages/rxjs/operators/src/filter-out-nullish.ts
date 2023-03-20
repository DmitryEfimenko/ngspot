import { filter, OperatorFunction, pipe } from 'rxjs';

/**
 * @usage
 * ```
 * source$.pipe(filterOutNullish())
 * ```
 */
export function filterOutNullish<T>(): OperatorFunction<
  T | null | undefined,
  T
> {
  return pipe(filter((x): x is T => x != null));
}
