import { DestroyRef, assertInInjectionContext, inject } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

export function injectDestroySink() {
  assertInInjectionContext(injectDestroySink);

  const destroyRef = inject(DestroyRef);
  const sink = new Subscription();
  const callbacks: Array<() => void> = [];

  destroyRef.onDestroy(() => {
    sink.unsubscribe();
    for (const callback of callbacks) {
      callback();
    }
  });

  return {
    subscribeTo: <T = unknown>(observable$: Observable<T>) => {
      sink.add(observable$.subscribe());
    },
    destroy: () => {
      sink.unsubscribe();
    },
    onDestroy: (callback: () => void) => {
      callbacks.push(callback);
    },
    add: sink.add,
  };
}
