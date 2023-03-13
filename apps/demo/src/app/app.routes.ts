import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PROJECTS } from './projects';

const packageRoutes: Route[] = PROJECTS.map((project) => {
  return {
    path: project.name,
    loadChildren: project.package,
    title: `@ngspot/${project.name}`,
  };
});

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    title: '@ngspot/*',
  },
  ...packageRoutes,
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
