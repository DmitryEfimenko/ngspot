import { Directive, effect, ElementRef, inject, input } from '@angular/core';

import { ViewTransitionNameForPassiveBase } from './view-transition-name-for-passive.directive';

@Directive({
  selector: '[vtClassForPassive]',
  standalone: true,
})
export class ClassForPassiveViewTransition {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  private viewTransitionNameForPassive = inject(
    ViewTransitionNameForPassiveBase,
    { self: true },
  );

  name = input.required<string>({ alias: 'vtClassForPassive' });

  #ef = effect(() => {
    const name = this.name();
    const isActive = this.viewTransitionNameForPassive.isActive();

    this.updateCssClass(name, isActive);
  });

  private updateCssClass(name: string, isActive: boolean) {
    if (isActive) {
      this.el.nativeElement.classList.add(name);
    } else {
      this.el.nativeElement.classList.remove(name);
    }
  }
}
