import { Directive, input } from '@angular/core';

@Directive({
  selector:
    '[vtActiveGroupId][vtNameForActive],[vtActiveGroupId][vtClassForActive]',
  standalone: true,
})
export class ViewTransitionActiveGroupId {
  id = input.required<string>({ alias: 'vtActiveGroupId' });
}
