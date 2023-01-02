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
];
