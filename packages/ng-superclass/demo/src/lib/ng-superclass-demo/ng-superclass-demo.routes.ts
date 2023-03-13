import { Route } from '@angular/router';

import { NgSuperclassDemoComponent } from './ng-superclass-demo.component';

export const routes: Route[] = [
  {
    path: '',
    component: NgSuperclassDemoComponent,
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];
