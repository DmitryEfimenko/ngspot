import { NgZone } from '@angular/core';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';

export function zoneFull<T>(ngZone: NgZone): MonoTypeOperatorFunction<T> {
  return (source) =>
    new Observable((subscriber) =>
      source.subscribe({
        next: (value) => ngZone.run(() => subscriber.next(value)),
        error: (error: unknown) => ngZone.run(() => subscriber.error(error)),
        complete: () => ngZone.run(() => subscriber.complete()),
      })
    );
}

export function zoneFree<T>(ngZone: NgZone): MonoTypeOperatorFunction<T> {
  return (source) =>
    new Observable((subscriber) =>
      ngZone.runOutsideAngular(() => source.subscribe(subscriber))
    );
}
