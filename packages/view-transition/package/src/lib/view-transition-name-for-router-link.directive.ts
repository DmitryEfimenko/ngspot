import { computed, Directive, inject, input } from '@angular/core';
import { createUrlTreeFromSnapshot, RouterLink } from '@angular/router';

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
  selector: '[vtNameForRouterLink]',
  standalone: true,
  host: { '[style.view-transition-name]': 'viewTransitionName()' },
})
export class ViewTransitionNameForRouterLink {
  private viewTransitionService = inject(ViewTransitionService);
  private routerLink = inject(RouterLink, { optional: true });

  vtName = input<string>('', { alias: 'vtNameForRouterLink' });

  protected readonly viewTransitionName = computed(() => {
    const currentTransition =
      this.viewTransitionService.currentRouteTransition();

    if (!currentTransition) {
      return 'none';
    }

    if (!this.routerLink) {
      const message =
        '`vtNameForRouterLink` directive should be applied to an element that has `[routerLink]` directive or on a child of an element with `[routerLink]` directive';
      throw new Error(message);
    } else {
      const linkUrl = this.routerLink.urlTree?.toString();

      const fromRouteUrl = createUrlTreeFromSnapshot(
        currentTransition.from.pathFromRoot[0],
        [],
      ).toString();

      const toRouteUrl = createUrlTreeFromSnapshot(
        currentTransition.to.pathFromRoot[0],
        [],
      ).toString();

      const apply = linkUrl === toRouteUrl || linkUrl === fromRouteUrl;

      const name = apply ? this.vtName() : 'none';

      return name;
    }
  });
}
