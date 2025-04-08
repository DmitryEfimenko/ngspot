import { Directive, input } from '@angular/core';

@Directive({
  selector: '[vtClassForActive]',
  standalone: true,
})
export class ClassForActiveViewTransition {
  activeClass = input.required<string>({ alias: 'vtClassForActive' });
}
