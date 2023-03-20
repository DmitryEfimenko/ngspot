import { Route } from '@angular/router';

export interface Project {
  name: string;
  package: () => Promise<{ default: Route[] }>;
  githubLink: string;
}

export const PROJECTS: Project[] = [
  {
    name: 'expandable-input',
    package: () => import('@ngspot/expandable-input-demo'),
    githubLink:
      'https://github.com/DmitryEfimenko/ngspot/tree/main/packages/expandable-input/package',
  },
  {
    name: 'ng-superclass',
    package: () => import('@ngspot/ng-superclass-demo'),
    githubLink:
      'https://github.com/DmitryEfimenko/ngspot/tree/main/packages/ng-superclass/package',
  },
  {
    name: 'ng-superclass-material',
    package: () => import('@ngspot/ng-superclass-material-demo'),
    githubLink:
      'https://github.com/DmitryEfimenko/ngspot/tree/main/packages/ng-superclass-material/package',
  },
];
