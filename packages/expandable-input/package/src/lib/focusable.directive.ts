import { Directive, ElementRef, inject, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[ngsFocusable]',
  standalone: true,
})
export class FocusableDirective implements OnChanges {
  @Input('ngsFocusable') focusable: boolean;
  @Input() ngsFocusableSelector: string;

  private elRef = inject(ElementRef);

  ngOnChanges() {
    const el: HTMLElement = this.elRef.nativeElement;
    const target = this.ngsFocusableSelector
      ? el.querySelector<HTMLElement>(this.ngsFocusableSelector)
      : el;

    if (target) {
      if (this.focusable) {
        target.tabIndex = 0;
      } else {
        target.tabIndex = -1;
      }
    }
  }
}
