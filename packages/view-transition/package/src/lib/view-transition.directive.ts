import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Directive,
  inject,
  input,
  SimpleChange,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { ViewTransitionService } from './view-transition.service';

import type { ViewTransitionNameForPassiveBase } from './view-transition-name-for-passive.directive';

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
export class ViewTransitionRenderer<T> {
  private viewTransitionService = inject(ViewTransitionService);
  private document = inject<DocumentWithViewTransition>(DOCUMENT);
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private cdr = inject(ChangeDetectorRef);
  private vtNameRegistry = new Set<ViewTransitionNameForPassiveBase>();
  private isRunningTransition = false;

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

    const shouldAnimate =
      !changes.trackingData.firstChange && (vmWatchNotProvided || watchChanged);

    this.prevWatch = this.vtWatch();

    if (!this.document.startViewTransition || !shouldAnimate) {
      this.render(
        changes.trackingData.firstChange,
        changes.trackingData.currentValue,
      );

      return;
    }

    // assign these variables outside of the callback to avoid closure issues
    const firstChange = changes.trackingData.firstChange;
    const currentValue = changes.trackingData.currentValue;
    const debugName = this.vtName();

    this.isRunningTransition = true;
    this.setEnabledForAllVtNames(true);

    this.viewTransitionService.run(
      () => {
        this.render(firstChange, currentValue);

        this.viewTransitionService.onViewTransitionFinishedCallback(() => {
          this.isRunningTransition = false;
          this.setEnabledForAllVtNames(false);
        });
      },
      {
        debugName,
        debugData: currentValue,
      },
    );
  }

  registerVtName(vtName: ViewTransitionNameForPassiveBase) {
    if (!this.isRunningTransition) {
      vtName.enabledThroughVtDirective.set(false);
    }
    this.vtNameRegistry.add(vtName);
  }

  unregisterVtName(vtName: ViewTransitionNameForPassiveBase) {
    vtName.enabledThroughVtDirective.set(true);
    this.vtNameRegistry.delete(vtName);
  }

  private render(isFirstChange: boolean, trackingData: T) {
    this.context.$implicit = trackingData;

    if (isFirstChange) {
      this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
    }

    this.cdr.detectChanges();
  }

  private setEnabledForAllVtNames(isEnabled: boolean) {
    this.vtNameRegistry.forEach((vtName) => {
      vtName.enabledThroughVtDirective.set(isEnabled);
    });
  }
}
