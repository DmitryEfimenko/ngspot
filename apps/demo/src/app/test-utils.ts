/* eslint-disable @typescript-eslint/no-explicit-any */

import { MediaMatcher } from '@angular/cdk/layout';
import { Provider } from '@angular/core';

/* eslint-disable @typescript-eslint/no-empty-function */
export class FakeMediaQueryList implements MediaQueryList {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
  addListener(
    _callback: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null
  ): void {}
  removeListener(
    _callback: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null
  ): void {}
  addEventListener<K extends 'change'>(
    type: K,
    listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined
  ): void;
  addEventListener(
    _type: unknown,
    _listener: unknown,
    _options?: unknown
  ): void {}
  removeEventListener<K extends 'change'>(
    type: K,
    listener: (this: MediaQueryList, ev: MediaQueryListEventMap[K]) => any,
    options?: boolean | EventListenerOptions | undefined
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions | undefined
  ): void;
  removeEventListener(
    _type: unknown,
    _listener: unknown,
    _options?: unknown
  ): void {}
  dispatchEvent(_event: Event): boolean {
    return true;
  }
}

export class FakeMediaMatcher {
  matchMedia(_query: string): MediaQueryList {
    return new FakeMediaQueryList();
  }
}

export const FakeMediaMatcherProvider: Provider = {
  provide: MediaMatcher,
  useClass: FakeMediaMatcher,
};
