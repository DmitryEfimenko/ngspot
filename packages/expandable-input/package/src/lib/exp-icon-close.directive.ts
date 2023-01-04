import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngsExpIconClose]',
  standalone: true,
})
export class ExpIconCloseDirective {
  templateRef = inject(TemplateRef);
}
