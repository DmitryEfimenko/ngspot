import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngsSnippetResult]',
  standalone: true,
})
export class SnippetResultDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
