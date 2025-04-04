import { Directive, effect, ElementRef, inject, input } from '@angular/core';

import { ViewTransitionNameForPassiveBase } from './view-transition-name-for-passive.directive';

/**
 * Directive that sets view transition name when the passive vtName value matches
 * the name set by `ViewTransitionService.setActiveViewTransitionNames()` method.
 *
 * If the element also has the `[vtName]` or [vtNameForPassive] directive,
 * the view transition name will be set the value provided the `[vtNameForActive]` directive.
 *
 * Example:
 * ```html
 * \@for (let item of items; trackBy: item.id) {
 *   <div
 *     [vtNameForActive]="'my-custom-animation'"
 *     [vtNameForPassive]="'animate-item-' + item.id"
 *   >
 *     {{ item.name }}
 *   </div>
 * }
 * ```
 * Given that `item.id` is `1`, while the element is passive,
 * the view transition name will be set to `animate-item-1`.
 *
 * ```ts
 * viewTransitionService.setActiveViewTransitionNames(`animate-item-1`);
 * ```
 * After the above method is called, the view transition name will
 * be set to `my-custom-animation` because `animate-item-1` matches the
 * `[vtNameForPassive]` value.
 *
 * This way you can target that specific view transition name in the CSS.
 */
@Directive({
  selector: '[vtNameForActive]',
  standalone: true,
})
export class ViewTransitionForActive {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  private viewTransitionNameForPassive = inject(
    ViewTransitionNameForPassiveBase,
    { self: true },
  );

  name = input.required<string>({ alias: 'vtNameForActive' });

  #ef = effect(() => {
    const name = this.name();
    const isActive = this.viewTransitionNameForPassive.isActive();

    this.updateViewTransitionName(isActive, name);
  });

  private updateViewTransitionName(isActive: boolean, name: string) {
    if (isActive) {
      this.el.nativeElement.style.viewTransitionName = name;
    } else {
      this.el.nativeElement.style.removeProperty('view-transition-name');
    }
  }
}
