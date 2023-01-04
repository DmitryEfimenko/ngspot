import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngsExpIconAction]',
  standalone: true,
})
export class ExpIconActionDirective {
  templateRef = inject(TemplateRef);
}
