import { Route } from '@angular/router';

import { ROUTED_TABS_PATH } from '@ngspot/common/routed-tabs';

import { ImageDetailsComponent } from './view-transition-demo/route-animation/image-details-page.component';
import { ViewTransitionRouteAnimationDemoComponent } from './view-transition-demo/route-animation/route-animation-demo.component';
import { ViewTransitionDemoComponent } from './view-transition-demo/view-transition-demo.component';

export const routes: Route[] = [
  {
    path: ROUTED_TABS_PATH,
    component: ViewTransitionDemoComponent,
    children: [
      { path: '', component: ViewTransitionRouteAnimationDemoComponent },
      { path: ':id', component: ImageDetailsComponent },
    ],
  },
  { path: '', redirectTo: 'basic', pathMatch: 'full' },
];
