import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
} from '@angular/core';

import { ViewTransitionActiveGroupId } from './view-transition-active-group-id.directive';
import { ViewTransitionForActive } from './view-transition-name-for-active.directive';
import { ViewTransitionRenderer } from './view-transition.directive';
import { ViewTransitionService } from './view-transition.service';

@Directive()
export abstract class ViewTransitionNameForPassiveBase {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  private viewTransitionService = inject(ViewTransitionService);

  private viewTransitionRenderer = inject(ViewTransitionRenderer, {
    optional: true,
    skipSelf: true,
  });

  private vtNameForActive = inject(ViewTransitionForActive, {
    optional: true,
    self: true,
  });

  private activeGroupId = inject(ViewTransitionActiveGroupId, {
    optional: true,
    self: true,
  });

  abstract name: InputSignal<string>;
  abstract enabledInput: InputSignal<boolean>;

  private enabled = computed(() => {
    const enabledThroughVtDirective =
      this.viewTransitionRenderer?.isRunningTransition() ?? true;

    return (
      this.enabledInput() &&
      enabledThroughVtDirective &&
      !this.viewTransitionService.currentRouteTransition()
    );
  });

  isActive = computed(() => {
    const name = this.name();

    const activeGroupId = this.activeGroupId?.id();

    const activeVTNames =
      this.viewTransitionService.activeViewTransitionNames();

    if (!activeVTNames || activeVTNames.length === 0) {
      return false;
    }

    const includesVtName = activeVTNames.includes(name);
    const includesGroupId = activeGroupId
      ? activeVTNames.includes(activeGroupId)
      : false;

    return includesVtName || includesGroupId;
  });

  private nameToApply = computed(() => {
    if (this.vtNameForActive && this.isActive()) {
      return this.vtNameForActive.name();
    }

    return this.enabled() ? this.name() : 'none';
  });

  #ef = effect(() => {
    const name = this.nameToApply();

    this.updateViewTransitionName(name);
  });

  private updateViewTransitionName(name: string) {
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
