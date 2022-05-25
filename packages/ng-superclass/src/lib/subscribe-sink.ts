import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Extend this when need to handle subscriptions clean up or side-effects
 *
 * ```ts
 * @Component({
 *   selector: "app-color-text",
 *   template: `<span (click)="performMyAction('run')">{{ color }}</span>`,
 *   changeDetection: ChangeDetectionStrategy.OnPush,
 * })
 * class ColorTextComponent extends SubscribeSink {
 *   @Input() color: string;
 *
 *   color$ = this.getInput$("color");
 *
 *   constructor() {
 *     super();
 *
 *     const someOtherObservable$ = this.color$.pipe(...);
 *
 *     // no need to worry about unsubscribing. It'll be done automatically
 *     this.subscribeTo(someOtherObservable$);
 *   }
 *
 *   performMyAction = this.createEffect((action$) =>
 *     action$.pipe(
 *       switchMap((action) => api.post(action))
 *     )
 *   );
 * }
 */
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

export function createEffectFn<T>(
  factoryFn: (source: Observable<T>) => Observable<unknown>
) {
  return function (destroyed$: Observable<boolean>) {
    const subject = new Subject<T>();

    factoryFn(subject.asObservable()).pipe(takeUntil(destroyed$)).subscribe();

    return function (value: T) {
      subject.next(value);
    };
  };
}
