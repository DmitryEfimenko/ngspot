import { Route } from '@angular/router';
import { ROUTED_TABS_PATH } from '@ngspot/common/routed-tabs';

import { ExpandableInputDemoComponent } from './expandable-input-demo.component';

export const routes: Route[] = [
  {
    path: ROUTED_TABS_PATH,
    component: ExpandableInputDemoComponent,
  },
  { path: '', redirectTo: 'basic', pathMatch: 'full' },
];
