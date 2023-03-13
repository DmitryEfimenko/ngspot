import { RoutedTabDirective } from './routed-tab.directive';
import { RoutedTabsComponent } from './routed-tabs.component';

export * from './routed-tab.directive';
export * from './routed-tabs.component';

export const ROUTED_TABS_DECLARATIONS = [
  RoutedTabDirective,
  RoutedTabsComponent,
] as const;
