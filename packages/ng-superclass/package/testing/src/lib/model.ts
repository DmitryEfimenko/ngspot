/* eslint-disable @typescript-eslint/ban-types */

export type JestDescribeLike = (name: string, fn: () => void) => void;

export type JestItLike = (name: string, fn: () => void) => void;

export interface JestExpectLike {
  <T>(actual: T): JasmineMatchersLike<T>;
}

export interface JasmineMatchersLike<T> {
  toBe(expected: Expected<T>): void;
}

export type Expected<T> = T;
