import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    title: '@ngspot/*',
  },
  {
    path: 'expandable-input',
    loadChildren: () => import('@ngspot/expandable-input-demo'),
    title: '@ngspot/expandable-input',
  },
];
