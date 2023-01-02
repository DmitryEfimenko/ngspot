import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'expandable-input',
    loadChildren: () => import('@ngspot/expandable-input-demo'),
  },
];
