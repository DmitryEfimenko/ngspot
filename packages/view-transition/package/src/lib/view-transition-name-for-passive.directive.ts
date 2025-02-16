import {
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  signal,
} from '@angular/core';

import { ViewTransitionForActive } from './view-transition-name-for-active.directive';
import { ViewTransitionRenderer } from './view-transition.directive';
import { ViewTransitionService } from './view-transition.service';

@Directive()
export abstract class ViewTransitionNameForPassiveBase {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private destroyRef = inject(DestroyRef);

  private viewTransitionService = inject(ViewTransitionService);

  private viewTransitionRenderer = inject(ViewTransitionRenderer, {
    optional: true,
    skipSelf: true,
  });

  private viewTransitionForActive = inject(ViewTransitionForActive, {
    optional: true,
    self: true,
  });

  abstract name: InputSignal<string>;
  abstract enabledInput: InputSignal<boolean>;

  enabledThroughVtDirective = signal<boolean>(true);

  enabled = computed(() => {
    return (
      this.enabledInput() &&
      this.enabledThroughVtDirective() &&
      !this.viewTransitionService.currentRouteTransition()
    );
  });

  private hasActiveViewTransition = computed(() => {
    return (
      !!this.viewTransitionForActive && this.viewTransitionForActive.isActive()
    );
  });

  #ef = effect(() => {
    const name = this.enabled() ? this.name() : 'none';

    const hasActiveViewTransition = this.hasActiveViewTransition();

    this.updateViewTransitionName(name, hasActiveViewTransition);
  });

  constructor() {
    this.viewTransitionRenderer?.registerVtName(this);

    this.destroyRef.onDestroy(() => {
      this.viewTransitionRenderer?.unregisterVtName(this);
    });
  }

  private updateViewTransitionName(
    name: string,
    hasActiveViewTransition: boolean,
  ) {
    if (hasActiveViewTransition) {
      // let the active directive handle manage the name
      return;
    }

    if (!this.el.nativeElement.style) {
      return;
    }

    this.el.nativeElement.style.viewTransitionName = name;
  }
}

/**
 * Sets the `view-transition-name` CSS style for an element.
 *
 * If this directive is used together with `[vtNameForActive]` directive,
 * the view-transition-name will be set to the value provided by this directive
 * by default, but will be overridden by the `[vtNameForActive]` directive
 * once the [vtId] matches the id set by `ViewTransitionService.setTransitionActiveElementId()`.
 *
 * If this directive is used inside of the `*vt` directive, the `view-transition-name`
 * style will be set to `"none"` when view transition is not running.
 *
 * The value of `view-transition-name` style will also be set to `"none"`
 * when there is an active route transition.
 *
 * For animating route transitions, use `[vtNameForRouting]` and `[vtNameForRouterLink]` directive.
 *
 * @example
 * ```html
 * <div [vtName]="'my-custom-animation'">...</div>
 * ```
 */
@Directive({
  selector: '[vtName]',
  standalone: true,
})
export class ViewTransitionNameForPassiveShorthand extends ViewTransitionNameForPassiveBase {
  override name = input.required<string>({ alias: 'vtName' });
  override enabledInput = input<boolean>(true, { alias: 'vtNameEnabled' });
}

/**
 * The same as `[vtName]` directive, but with explicit name input.
 * Use this when also applying `[vtNameForActive]` directive to the same element.
 * This way it is clear which name is used for passive view transition.
 */
@Directive({
  selector: '[vtNameForPassive]',
  standalone: true,
})
export class ViewTransitionNameForPassiveExplicit extends ViewTransitionNameForPassiveBase {
  override name = input.required<string>({ alias: 'vtNameForPassive' });
  override enabledInput = input<boolean>(true, {
    alias: 'vtNameForPassiveEnabled',
  });
}
