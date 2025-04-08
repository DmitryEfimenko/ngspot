import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';

import { ClassForActiveViewTransition } from './class-for-active.directive';
import { ViewTransitionActiveGroupId } from './view-transition-active-group-id.directive';
import { ViewTransitionNameForPassiveBase } from './view-transition-name-for-passive.directive';
import { ViewTransitionRenderer } from './view-transition.directive';
import { ViewTransitionService } from './view-transition.service';

@Directive({
  selector: '[vtClassForPassive]',
  standalone: true,
})
export class ClassForPassiveViewTransition {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  private viewTransitionService = inject(ViewTransitionService);

  private viewTransitionRenderer = inject(ViewTransitionRenderer, {
    optional: true,
    skipSelf: true,
  });

  private vtNameForPassive = inject(ViewTransitionNameForPassiveBase, {
    optional: true,
    self: true,
  });

  private vtClassForActive = inject(ClassForActiveViewTransition, {
    optional: true,
    self: true,
  });

  private activeGroupId = inject(ViewTransitionActiveGroupId, {
    optional: true,
    self: true,
  });

  passiveClass = input.required<string>({ alias: 'vtClassForPassive' });

  private enabled = computed(() => {
    const enabledThroughVtDirective =
      this.viewTransitionRenderer?.isRunningTransition() ?? true;

    return (
      enabledThroughVtDirective &&
      !this.viewTransitionService.currentRouteTransition()
    );
  });

  private isActive = computed(() => {
    const name = this.vtNameForPassive?.name();

    const activeGroupId = this.activeGroupId?.id();

    const activeVTNames =
      this.viewTransitionService.activeViewTransitionNames();

    if (!activeVTNames || activeVTNames.length === 0) {
      return false;
    }

    const includesVtName = name && activeVTNames.includes(name);
    const includesGroupId = activeGroupId
      ? activeVTNames.includes(activeGroupId)
      : false;

    return includesVtName || includesGroupId;
  });

  #ef = effect(() => {
    const isActive = this.isActive();
    const activeClass = this.vtClassForActive?.activeClass();
    const passiveClass = this.passiveClass();
    const enabled = this.enabled();

    if (activeClass) {
      if (isActive) {
        this.removeClass(passiveClass);
        this.addClass(activeClass);
      } else {
        this.removeClass(activeClass);
        if (enabled) {
          this.addClass(passiveClass);
        }
      }
      return;
    }

    if (enabled) {
      this.addClass(passiveClass);
    } else {
      this.removeClass(passiveClass);
    }
  });

  private addClass(name: string) {
    if (name) {
      this.el.nativeElement.classList.add(name);
    }
  }

  private removeClass(name: string) {
    this.el.nativeElement.classList.remove(name);
  }
}
