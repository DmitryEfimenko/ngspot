import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngsSnippetDescription]',
  standalone: true,
})
export class SnippetDescriptionDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
