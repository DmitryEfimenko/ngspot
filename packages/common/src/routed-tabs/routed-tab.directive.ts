import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngsRoutedTab]',
  standalone: true,
})
export class RoutedTabDirective {
  @Input('ngsRoutedTab') routeName: string;
  @Input('ngsRoutedTabLabel') label: string;

  constructor(public templateRef: TemplateRef<any>) {}
}
