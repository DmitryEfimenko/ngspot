import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class SubscribeSink implements OnDestroy {
  private destroy$$ = new Subject<boolean>();
  destroy$ = this.destroy$$.asObservable();

  createEffect<T>(factoryFn: (source: Observable<T>) => Observable<unknown>) {
    return createEffectFn(factoryFn)(this.destroy$);
  }

  subscribeTo(source: Observable<any>) {
    source.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$$.next(true);
  }
}

export function createEffectFn<T>(factoryFn: (source: Observable<T>) => Observable<unknown>) {
  return function (destroyed$: Observable<boolean>) {
    const subject = new Subject<T>();

    factoryFn(subject.asObservable()).pipe(takeUntil(destroyed$)).subscribe();

    return function (value: T) {
      subject.next(value);
    };
  };
}
