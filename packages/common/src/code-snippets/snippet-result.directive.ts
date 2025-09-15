import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngsSnippetResult]',
  standalone: true,
})
export class SnippetResultDirective {
  public templateRef: TemplateRef<any> = inject(TemplateRef);
}
