import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';

import { ViewTransitionService } from './view-transition.service';

/**
 * Directive that sets view transition name when `[vtId]` matches
 * the `id` set by `ViewTransitionService.setTransitionActiveElementId()` method.
 *
 * If the element also has the `[vtName]` or [vtNameForPassive] directive,
 * the view transition name will be set the value provided the `[vtNameForActive]` directive.
 *
 * Example:
 * ```html
 * \@for (let item of items; trackBy: item.id) {
 *   <div
 *     [vtId]="'item-' + item.id"
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
 * viewTransitionService.setTransitionActiveElementId(`item-1`);
 * ```
 * After the above method is called, the view transition name will
 * be set to `my-custom-animation` because `item-1` matches the `[vtId]` value.
 *
 * This way you can target that specific view transition name in the CSS.
 */
@Directive({
  selector: '[vtNameForActive]',
  standalone: true,
})
export class ViewTransitionForActive {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewTransitionService = inject(ViewTransitionService);

  name = input.required<string>({ alias: 'vtNameForActive' });
  vtId = input.required<number | string>();

  isActive = computed(() => {
    return (
      this.viewTransitionService.transitionActiveElementId() === this.vtId()
    );
  });

  #ef = effect(() => {
    const name = this.name();
    const isActive = this.isActive();

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
