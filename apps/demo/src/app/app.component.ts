import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { HighlightLoader } from 'ngx-highlightjs';
import { BehaviorSubject, map } from 'rxjs';

import { RouterActivatedMatListItemDirective } from '@ngspot/common/router-activated-mat-list-item';

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
    NgxGoogleAnalyticsRouterModule,
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
        `Check out @ngspot/${project?.name ?? '*'}\n\n${link}`,
      );
      return `https://twitter.com/intent/tweet?text=${tweetText}`;
    }),
  );

  githubLink$ = this.activeProject$$.pipe(
    map((project) => project?.githubLink),
  );

  @HostBinding('class.dark')
  isDarkTheme = true;

  private changeDetectorRef = inject(ChangeDetectorRef);
  private media = inject(MediaMatcher);
  private hljsLoader = inject(HighlightLoader);

  constructor() {
    this.wireMediaListener();
    this.setTheme();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.setTheme();
  }

  private setTheme() {
    const theme = this.isDarkTheme ? 'monokai-sublime' : 'vs';
    this.hljsLoader.setTheme(`assets/highlightjs/${theme}.css`);
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
