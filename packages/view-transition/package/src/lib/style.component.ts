import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'vt-style',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
})
export class VtStyleComponent implements OnDestroy {
  private elRef = inject(ElementRef);
  private styleEl: HTMLStyleElement | undefined;

  vtStyle = input.required<string>();

  #ef = effect(() => {
    if (!this.styleEl) {
      this.styleEl = document.createElement('style');
      this.styleEl.appendChild(document.createTextNode(this.vtStyle()));
      this.elRef.nativeElement.appendChild(this.styleEl);
    }

    if (this.styleEl) {
      this.styleEl.textContent = this.vtStyle();
    }
  });

  ngOnDestroy() {
    if (this.styleEl) {
      this.styleEl.remove();
    }
  }
}
