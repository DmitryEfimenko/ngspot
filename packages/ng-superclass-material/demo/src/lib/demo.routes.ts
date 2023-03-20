import { Route } from '@angular/router';

import { NgSuperclassMaterialDemoComponent } from './demo.component';

export const routes: Route[] = [
  {
    path: '',
    component: NgSuperclassMaterialDemoComponent,
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];
