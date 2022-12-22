import { Directive } from '@angular/core';

/**
 * Directive that targets an element that will be expanded/collapsed.
 * It can be either the <input /> element itself or its parent.
 */
@Directive({
  selector: '[ngsExpInput]',
  standalone: true,
})
export class ExpInputDirective {}
