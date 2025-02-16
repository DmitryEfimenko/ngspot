import { computed, Directive, inject, input } from '@angular/core';

import { ViewTransitionService } from './view-transition.service';

/**
 * Directive that sets view-transition-name CSS style when the route
 * is navigated.
 *
 * If directive is applied to an element that has `[routerLink]` directive,
 * or to the element that is a child of the element with `[routerLink]` directive,
 * the view-transition-name will be set only if the destination route matches
 * the route of the link.
 */
@Directive({
  selector: '[vtNameForRouting]',
  standalone: true,
  host: { '[style.view-transition-name]': 'viewTransitionName()' },
})
export class ViewTransitionNameForRouting {
  private viewTransitionService = inject(ViewTransitionService);

  vtName = input<string>('', { alias: 'vtNameForRouting' });

  protected readonly viewTransitionName = computed(() => {
    const currentTransition =
      this.viewTransitionService.currentRouteTransition();

    if (!currentTransition) {
      return 'none';
    }

    return this.vtName();
  });
}
