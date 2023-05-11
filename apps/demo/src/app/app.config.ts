import {
  ApplicationConfig,
  EnvironmentProviders,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';

import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { environment } from '../environments/environment';

import { appRoutes } from './app.routes';
import { customIconsProviders } from './shared/custom-icons';

const highlightOptions: Provider = {
  provide: HIGHLIGHT_OPTIONS,
  useValue: {
    coreLibraryLoader: () => import('highlight.js/lib/core'),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
    languages: {
      typescript: () => import('highlight.js/lib/languages/typescript'),
      css: () => import('highlight.js/lib/languages/css'),
      xml: () => import('highlight.js/lib/languages/xml'),
    },
    themePath: 'assets/highlightjs/monokai-sublime.css',
  },
};

const analyticsProviders: Provider[] | EnvironmentProviders[] =
  environment.stage === 'prod'
    ? [
        importProvidersFrom(
          NgxGoogleAnalyticsModule.forRoot(
            'G-DQFP38FYZC',
            [],
            undefined,
            environment.stage === 'prod'
          )
        ),
      ]
    : ([] as Provider[]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    importProvidersFrom(BrowserAnimationsModule),
    highlightOptions,
    ...customIconsProviders,
    ...analyticsProviders,
  ],
};
