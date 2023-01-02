import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { RouterActivatedMatListItemDirective } from '@ngspot/common';
import { BehaviorSubject, map } from 'rxjs';

import { Project, PROJECTS } from './projects';

@Component({
  selector: 'ngs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterActivatedMatListItemDirective,
  ],
})
export class AppComponent {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  projects = PROJECTS;

  activeProject$$ = new BehaviorSubject<Project | undefined>(undefined);

  twitterLink$ = this.activeProject$$.pipe(
    map((project) => {
      const link = window.location.href;
      const tweetText = encodeURIComponent(
        `Check out @ngspot/${project?.name ?? '*'}\n\n${link}`
      );
      return `https://twitter.com/intent/tweet?text=${tweetText}`;
    })
  );

  githubLink$ = this.activeProject$$.pipe(
    map((project) => project?.githubLink)
  );

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.wireMediaListener();
  }

  trackByName(ix: number, project: Project) {
    return project.name;
  }

  private wireMediaListener() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => {
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }
}
