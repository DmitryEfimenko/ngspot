/* eslint-disable @typescript-eslint/ban-types */

export type JestDescribeLike = (name: string, fn: () => void) => void;

export type JestItLike = (name: string, fn: () => void) => void;

export interface JestExpectLike {
  <T = any>(actual: T): JestMatchersLike<T>;
}

export type JestMatchersLike<T> = JestMatchersShape<
  MatchersLike<void, T>,
  MatchersLike<Promise<void>, T>
>;

export type JestMatchersShape<
  TNonPromise extends {} = {},
  TPromise extends {} = {}
> = {
  /**
   * Use resolves to unwrap the value of a fulfilled promise so any other
   * matcher can be chained. If the promise is rejected the assertion fails.
   */
  resolves: AndNot<TPromise>;
  /**
   * Unwraps the reason of a rejected promise so any other matcher can be chained.
   * If the promise is fulfilled the assertion fails.
   */
  rejects: AndNot<TPromise>;
} & AndNot<TNonPromise>;

export type AndNot<T> = T & {
  not: T;
};

export interface MatchersLike<R, T = {}> {
  toBe<E = any>(expected: E): R;
}
