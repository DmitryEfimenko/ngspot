import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngsExpIconOpen]',
  standalone: true,
})
export class ExpIconOpenDirective {
  templateRef = inject(TemplateRef);
}
