import { Route } from '@angular/router';

import { NgxErrorsDemoComponent } from './ngx-errors-demo/ngx-errors-demo.component';

export const routes: Route[] = [
  {
    path: '',
    component: NgxErrorsDemoComponent,
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];
