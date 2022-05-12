import { Directive, OnChanges, SimpleChanges } from '@angular/core';
import { asapScheduler, BehaviorSubject, merge, Observable, of, Subject } from 'rxjs';
import { delay, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { SubscribeSink } from './subscribe-sink';

/**
 * Extend this when creating a directive (including a component, which is a kind of directive) to gain access to the helpers demonstrated below. **Warning:** You _must_ include a constructor in your subclass.
 *
 * ```ts
 * @Component({
 *   selector: "s-color-text",
 *   template: `
 *     <span [style.background]="color">{{ color }}</span>
 *   `,
 *   // note that `bindToInstance()` works even with OnPush change detection
 *   changeDetection: ChangeDetectionStrategy.OnPush,
 * })
 *  class ColorTextComponent extends DirectiveSuperclass {
 *   @Input() color: string;
 *
 *   constructor(
 *     @Inject("color$") color$: Observable<string>,
 *     injector: Injector,
 *   ) {
 *     super(injector);
 *
 *     // combine everything to calculate `color` and keep it up to date
 *     this.bindToInstance(
 *       "color",
 *       combineLatest(
 *         this.getInput$("prefix"),
 *         this.getInput$("prefix2"),
 *         color$,
 *       ).pipe(map((parts) => parts.filter((p) => p).join(""))),
 *     );
 *   }
 * }
 * ```
 */
// maybe this won't need the fake selector after https://github.com/angular/angular/issues/36427
@Directive({ selector: '[scDirectiveSuperclass]' })
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class DirectiveSuperclass extends SubscribeSink implements OnChanges {
  /**
   *  Emits the set of `@Input()` property names that change during each call to `ngOnChanges()`.
   */
  inputChanges$ = new Subject<Set<keyof this>>();

  private onChangesRan$$ = new BehaviorSubject(false);

  onChangesRan$ = this.onChangesRan$$.asObservable().pipe(
    filter((x) => x),
    distinctUntilChanged()
  );

  ngOnChanges(changes: SimpleChanges): void {
    this.inputChanges$.next(new Set(Object.getOwnPropertyNames(changes) as Array<keyof this>));
    this.onChangesRan$$.next(true);
  }

  /**
   * @return an observable of the values for one of this directive's `@Input()` properties
   */
  getInput$<K extends keyof this>(key: K): Observable<this[K]> {
    // Should emit:
    //   - immediately if ngOnChanges was already called
    //   - on the first call to ngOnChanges
    //   - after a delay if ngOnChanges is never called (when nothing is bound to the directive)
    //   - when the value actually changes
    return merge(this.onChangesRan$, this.inputChanges$, of(0).pipe(delay(0, asapScheduler))).pipe(
      map(() => this[key]),
      distinctUntilChanged()
    );
  }
}
