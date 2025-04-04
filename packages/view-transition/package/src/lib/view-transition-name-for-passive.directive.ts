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

  isActive = computed(() => {
    const name = this.name();
    const activeVTNames =
      this.viewTransitionService.activeViewTransitionNames();

    return activeVTNames?.includes(name) ?? false;
  });

  #ef = effect(() => {
    const name = this.enabled() ? this.name() : 'none';

    const isActive = this.isActive();

    this.updateViewTransitionName(name, isActive);
  });

  constructor() {
    this.viewTransitionRenderer?.registerVtName(this);

    this.destroyRef.onDestroy(() => {
      this.viewTransitionRenderer?.unregisterVtName(this);
    });
  }

  private updateViewTransitionName(name: string, isActive: boolean) {
    if (isActive) {
      // let the active directive manage the name
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
 * once the `view-transition-name` matches the id set by
 * `ViewTransitionService.setActiveViewTransitionNames()`.
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
  providers: [
    {
      provide: ViewTransitionNameForPassiveBase,
      useExisting: ViewTransitionNameForPassiveShorthand,
    },
  ],
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
  providers: [
    {
      provide: ViewTransitionNameForPassiveBase,
      useExisting: ViewTransitionNameForPassiveExplicit,
    },
  ],
})
export class ViewTransitionNameForPassiveExplicit extends ViewTransitionNameForPassiveBase {
  override name = input.required<string>({ alias: 'vtNameForPassive' });
  override enabledInput = input<boolean>(true, {
    alias: 'vtNameForPassiveEnabled',
  });
}
