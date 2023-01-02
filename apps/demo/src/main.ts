import { importProvidersFrom, Provider } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { customIconsProviders } from './app/shared/custom-icons';

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

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    importProvidersFrom(BrowserAnimationsModule),
    highlightOptions,
    ...customIconsProviders,
  ],
}).catch((err) => console.error(err));
