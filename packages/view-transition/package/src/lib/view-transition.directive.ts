import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChange,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { ViewTransitionService } from './view-transition.service';

interface Context<T> {
  $implicit: T;
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => Promise<void>) => void;
};

type Changes = Record<'trackingData', SimpleChange>;

function createContext<T>(data: T): Context<T> {
  return { $implicit: data };
}

const initialPrevWatch = '__initialPrevWatch__';

/**
 * Directive that wraps data binding change into a view transition
 *
 * @example
 * ```html
 * <div *vt="mySignal(); let mySignalValue">
 *   <span vtName="my-animation">
 *     {{ mySignalValue }}
 *   </span>
 * </div>
 * ```
 *
 * In the example above, the view transition will be scheduled to run
 * when `mySignal()` changes.
 *
 * When view transition is not running, all children elements with `vtName`
 * directive will get `view-transition-name` style set to `"none"`. Once the
 * view transition is scheduled, the style will be set to corresponding value
 * of `vtName` directive.
 */
@Directive({
  selector: '[vt]',
  standalone: true,
})
export class ViewTransitionRenderer<T> implements OnChanges {
  private viewTransitionService = inject(ViewTransitionService);
  private document = inject<DocumentWithViewTransition>(DOCUMENT);
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private cdr = inject(ChangeDetectorRef);
  isRunningTransition = signal(false);

  static ngTemplateContextGuard<T>(
    dir: ViewTransitionRenderer<T>,
    ctx: unknown,
  ): ctx is Context<T> {
    return true;
  }

  trackingData = input.required<T>({ alias: 'vt' });

  vtWatch = input<any>(initialPrevWatch);

  vtPriority = input<'high' | 'low'>();

  vtName = input<string>();

  private context: Context<T> = createContext(null as any);

  private prevWatch = initialPrevWatch;

  ngOnChanges(changes: Changes) {
    const vmWatchNotProvided = this.vtWatch() === initialPrevWatch;
    const watchChanged = this.vtWatch() !== this.prevWatch;

    // assign these variables outside of the run callback to avoid closure issues
    const firstChange = changes.trackingData.firstChange;
    const currentValue = changes.trackingData.currentValue;
    const debugName = this.vtName();

    const shouldAnimate = !firstChange && (vmWatchNotProvided || watchChanged);

    this.prevWatch = this.vtWatch();

    if (!this.document.startViewTransition || !shouldAnimate) {
      this.render(firstChange, currentValue);

      return;
    }

    this.isRunningTransition.set(true);

    this.viewTransitionService.run(
      () => {
        this.render(firstChange, currentValue);

        this.viewTransitionService.onViewTransitionFinishedCallback(() => {
          this.isRunningTransition.set(false);
        });
      },
      {
        debugName,
        debugData: currentValue,
      },
    );
  }

  private render(isFirstChange: boolean, trackingData: T) {
    this.context.$implicit = trackingData;

    if (isFirstChange) {
      this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
    }

    this.cdr.detectChanges();
  }
}
