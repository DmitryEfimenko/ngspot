import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';

import { ViewTransitionService } from './view-transition.service';

@Directive({
  selector: '[vtClassForActive]',
  standalone: true,
})
export class ClassForActiveViewTransition {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewTransitionService = inject(ViewTransitionService);

  name = input.required<string>({ alias: 'vtClassForActive' });
  vtId = input.required<number | string>();

  isActive = computed(() => {
    return (
      this.viewTransitionService.transitionActiveElementId() === this.vtId()
    );
  });

  #ef = effect(() => {
    const name = this.name();
    const isActive = this.isActive();

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
