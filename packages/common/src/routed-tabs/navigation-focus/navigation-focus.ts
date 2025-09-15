import {
  Directive,
  ElementRef,
  HostBinding,
  inject,
  OnDestroy,
} from '@angular/core';

import { NavigationFocusService } from './navigation-focus.service';

let uid = 0;
@Directive({
  selector: '[ngsFocusOnNavigation]',
  standalone: true,
})
export class NavigationFocusDirective implements OnDestroy {
  @HostBinding('tabindex') readonly tabindex = '-1';
  @HostBinding('style.outline') readonly outline = 'none';

  private el: ElementRef = inject(ElementRef);
  private navigationFocusService: NavigationFocusService = inject(
    NavigationFocusService,
  );

  constructor() {
    if (!this.el.nativeElement.id) {
      this.el.nativeElement.id = `skip-link-target-${uid++}`;
    }
    this.navigationFocusService.requestFocusOnNavigation(this.el.nativeElement);
    this.navigationFocusService.requestSkipLinkFocus(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.navigationFocusService.relinquishFocusOnNavigation(
      this.el.nativeElement,
    );
    this.navigationFocusService.relinquishSkipLinkFocus(this.el.nativeElement);
  }
}
