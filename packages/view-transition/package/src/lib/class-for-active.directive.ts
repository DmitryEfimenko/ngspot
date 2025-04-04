import { Directive, effect, ElementRef, inject, input } from '@angular/core';

import { ViewTransitionNameForPassiveBase } from './view-transition-name-for-passive.directive';

@Directive({
  selector: '[vtClassForActive]',
  standalone: true,
})
export class ClassForActiveViewTransition {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  private viewTransitionNameForPassive = inject(
    ViewTransitionNameForPassiveBase,
    { self: true },
  );

  name = input.required<string>({ alias: 'vtClassForActive' });

  #ef = effect(() => {
    const name = this.name();
    const isActive = this.viewTransitionNameForPassive.isActive();

    this.updateCssClass(isActive, name);
  });

  private updateCssClass(isActive: boolean, name: string) {
    if (isActive) {
      this.el.nativeElement.classList.add(name);
    } else {
      this.el.nativeElement.classList.remove(name);
    }
  }
}
