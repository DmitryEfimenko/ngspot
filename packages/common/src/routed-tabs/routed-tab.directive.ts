import { Directive, inject, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngsRoutedTab]',
  standalone: true,
})
export class RoutedTabDirective {
  @Input('ngsRoutedTab') routeName: string;
  @Input('ngsRoutedTabLabel') label: string;

  public templateRef: TemplateRef<any> = inject(TemplateRef);
}
