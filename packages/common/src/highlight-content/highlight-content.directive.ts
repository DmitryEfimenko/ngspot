import {
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';

import hljs from 'highlight.js';
import { HighlightJS } from 'ngx-highlightjs';
import { delay, map, Subscription, switchMap, tap } from 'rxjs';

import { mutationObserver } from '../rxjs';

@Directive({
  selector: '[ngsHighlightContent]',
  standalone: true,
})
export class HighlightContentDirective implements OnInit, OnDestroy {
  private subs = new Subscription();
  private elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private el = this.elRef.nativeElement;
  private highlightJS = inject(HighlightJS);
  private highlightTarget = document.createElement('pre');
  private highlight$ = mutationObserver(this.el, {
    childList: true,
    subtree: true,
    characterData: true,
  }).pipe(
    // delay so that el.innerHTML does not return null
    delay(0),
    map(() => this.el.innerHTML),
    switchMap((contents) =>
      this.highlightJS.highlightAuto(contents, hljs.listLanguages())
    ),
    map((result) => result.value),
    tap((highlighted) => (this.highlightTarget.innerHTML = highlighted ?? ''))
  );

  ngOnInit() {
    this.el.style.display = 'none';
    this.highlightTarget.classList.add(...Array.from(this.el.classList));
    this.el.insertAdjacentElement('afterend', this.highlightTarget);
    this.subs.add(this.highlight$.subscribe());
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
