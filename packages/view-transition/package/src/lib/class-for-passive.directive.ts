import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';

import { ClassForActiveViewTransition } from './class-for-active.directive';

@Directive({
  selector: '[vtClassForPassive]',
  standalone: true,
})
export class ClassForPassiveViewTransition {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  private classForActiveViewTransition = inject(ClassForActiveViewTransition, {
    optional: true,
    self: true,
  });

  name = input.required<string>({ alias: 'vtClassForPassive' });

  private hasActiveViewTransition = computed(() => {
    return (
      !!this.classForActiveViewTransition &&
      this.classForActiveViewTransition.isActive()
    );
  });

  #ef = effect(() => {
    const name = this.name();
    const hasActiveViewTransition = this.hasActiveViewTransition();

    this.updateCssClass(name, hasActiveViewTransition);
  });

  private updateCssClass(name: string, hasActiveViewTransition: boolean) {
    if (hasActiveViewTransition) {
      // let the active directive handle manage the name
      return;
    }

    if (!this.el.nativeElement.classList) {
      return;
    }

    this.el.nativeElement.classList.add(name);
  }
}
