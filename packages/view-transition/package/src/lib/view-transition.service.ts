import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Injector, NgZone, signal } from '@angular/core';
import { ViewTransitionInfo } from '@angular/router';

import {
  map,
  MonoTypeOperatorFunction,
  of,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { Callback, RunOptions, TransitionActiveElementId } from './model';

@Injectable({
  providedIn: 'root',
})
export class ViewTransitionService {
  private injector = inject(Injector);
  private document = inject(DOCUMENT);
  private ngZone = inject(NgZone);

  private enableLogging = false;
  private viewTransitionFinished$ = new Subject<void>();

  currentViewTransition: ViewTransition | null = null;
  currentRouteTransition = signal<ViewTransitionInfo | null>(null);
  transitionActiveElementId = signal<string | number | null>(null);

  private transitionActive = false;
  private viewTransitionStarted = false;
  private pendingCallbacks: Array<{
    callback: () => void;
    options?: RunOptions;
  }> = [];

  /**
   *
   * @param callback Function to run that will result in DOM manipulation.
   * This function will be scheduled to run in the callback of `startViewTransition` function.
   * This function can be called by multiple sources, and will be buffered and executed in order it was called.
   *
   * @param options
   * @returns
   */
  run(callback: Callback, options?: RunOptions): void {
    const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
    const disableAnimations = window.matchMedia(reducedMotionQuery).matches;

    if (disableAnimations) {
      callback();
      return;
    }

    this.log('--- run', options);

    if (this.currentRouteTransition()) {
      this.ngZone.run(() => {
        this.log('callback()', options);
        callback();
      });
      return;
    }

    this.pendingCallbacks.push({ callback, options });

    if (!this.transitionActive) {
      this.startTransition(options);
    } else if (this.viewTransitionStarted) {
      // Schedule a flush in a microtask to ensure all callbacks are queued first.
      // This ensures correct callback order execution
      Promise.resolve().then(() => {
        this.log('flushPendingCallbacks pending', options);
        this.flushPendingCallbacks();
      });
    }
  }

  /**
   * Marks an element with matching id as active for the next view transition.
   * Use this method together with `[vtNameForActive]` directive.
   * This is useful when you want to have a custom animation for an
   * element inside of a for-loop, that has dynamic view transition name
   * applied via `[vtName]` or `[vtNameForPassive]` directive.
   *
   * For more info see documentation for `[vtNameForActive]` directive.
   */
  setTransitionActiveElementId(id: TransitionActiveElementId) {
    this.transitionActiveElementId.set(id);
  }

  /**
   * RxJS operator that waits for the view transition to finish before emitting the value.
   * If there is no active view transition, the value is emitted immediately.
   */
  onViewTransitionFinished<T>(): MonoTypeOperatorFunction<T> {
    return (source) =>
      source.pipe(
        switchMap((value) => {
          if (!this.currentViewTransition) {
            return of(value);
          }
          return this.viewTransitionFinished$.pipe(
            take(1),
            map(() => value),
          );
        }),
      );
  }

  onViewTransitionFinishedCallback(callback: () => void) {
    if (!this.currentViewTransition) {
      callback();
    } else {
      this.viewTransitionFinished$
        .pipe(
          take(1),
          tap(() => {
            callback();
          }),
        )
        .subscribe();
    }
  }

  /**
   * This method is used by `onViewTransitionCreated` function passed
   * to the Angular router configuration to handle view transitions.
   * Example:
   * ```ts
   * provideRouter(routes, withViewTransitions({ onViewTransitionCreated })),
   * ```
   *
   * @param info ViewTransitionInfo object from Angular router
   */
  onRouterViewTransitionCreated(info: ViewTransitionInfo) {
    this.currentRouteTransition.set(info);

    this.log('route transition created', undefined, info);

    info.transition.finished.finally(() => {
      this.log('route transition finished', undefined, info);
      this.currentRouteTransition.set(null);
    });
  }

  private startTransition(options?: RunOptions): void {
    this.transitionActive = true;
    this.viewTransitionStarted = false;

    // Run the view transition logic outside Angular's zone so that promises
    // do not trigger extra change detection cycles
    this.ngZone.runOutsideAngular(() => {
      this.log('startTransition', options);
      this.currentViewTransition = this.documentStartViewTransition(
        async () => {
          this.viewTransitionStarted = true;
          this.log('flushPendingCallbacks immediate', options);

          // When the transition callback starts, we re-enter Angular zone.
          this.flushPendingCallbacks();

          await createRenderPromise(this.injector);

          this.log('stop callback execution', options);

          // Consider making the position of this assignment configurable.
          // If user wants to be able to interrupt an animation in progress
          // when a new callback is received after render promise but before
          // the animation was complete, this assignment should happen in
          // the `this.currentViewTransition.finished.then()` block.
          this.viewTransitionStarted = false;
        },
      );

      // When the transition finishes, handle state reset and restart if needed.
      this.currentViewTransition.finished
        .then(() => {
          this.log('transition finished');
          this.transitionActive = false;

          // If new callbacks have been buffered during/after the transition, start a new cycle.
          if (this.pendingCallbacks.length > 0) {
            this.log(
              'startTransition pending',
              options,
              this.pendingCallbacks.length,
            );
            // wait a microtask to allow DOM to settle so that
            // a clean snapshot of new state can be taken
            Promise.resolve().then(() => {
              this.startTransition(options);
            });
          } else {
            this.viewTransitionFinished$.next();
          }
        })
        .catch((error) => {
          console.error('View transition error:', error);
          this.transitionActive = false;
        });

      this.currentViewTransition.finished.finally(() => {
        this.currentViewTransition = null;
        this.transitionActiveElementId.set(null);
      });
    });
  }

  private flushPendingCallbacks(): void {
    // Flush buffered callbacks in FIFO order.
    if (this.pendingCallbacks.length > 0) {
      const callbacks = [...this.pendingCallbacks];
      this.pendingCallbacks = [];
      callbacks.forEach(({ callback, options }) => {
        this.ngZone.run(() => {
          this.log('callback()', options);
          callback();
        });
      });
    }
  }

  private documentStartViewTransition(callback: () => Promise<void>) {
    return this.document.startViewTransition(callback);
  }

  private log(text: string, options?: RunOptions, additionalData?: unknown) {
    if (!this.enableLogging) {
      return;
    }

    let prefix = `[vt]`;

    if (this.transitionActiveElementId()) {
      prefix = prefix.concat(` [${this.transitionActiveElementId()}]`);
    }

    if (options?.debugName) {
      prefix = prefix.concat(` [${options.debugName}]`);
    }

    const arr: unknown[] = [prefix, text];

    // if (options?.debugData) {
    //   arr.push(options.debugData);
    // }

    if (additionalData) {
      arr.push(additionalData);
    }

    console.log(...arr);
  }
}

/**
 * Creates a promise that resolves after next render.
 */
function createRenderPromise(injector: Injector) {
  return new Promise<void>((resolve) => {
    // Wait for the microtask queue to empty after the next render happens (by waiting a macrotask).
    // This ensures any follow-up renders in the microtask queue are completed before the
    // view transition starts animating.
    // afterNextRender({ read: () => setTimeout(resolve) }, { injector });
    setTimeout(resolve);
  });
}

export function onViewTransitionCreated(info: ViewTransitionInfo) {
  const vts = inject(ViewTransitionService);
  vts.onRouterViewTransitionCreated(info);
}
