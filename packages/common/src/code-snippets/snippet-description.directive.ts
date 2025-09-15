import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngsSnippetDescription]',
  standalone: true,
})
export class SnippetDescriptionDirective {
  public templateRef: TemplateRef<any> = inject(TemplateRef);
}
