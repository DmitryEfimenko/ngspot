import { Route } from '@angular/router';

import { NgxErrorsMaterialDemoComponent } from './ngx-errors-material-demo/ngx-errors-material-demo.component';

export const routes: Route[] = [
  {
    path: '',
    component: NgxErrorsMaterialDemoComponent,
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];
