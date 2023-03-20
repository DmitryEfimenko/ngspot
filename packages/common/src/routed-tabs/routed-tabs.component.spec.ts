import { RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createHostFactory } from '@ngneat/spectator';
import { ReplaySubject } from 'rxjs';

import { NavigationFocusService } from './navigation-focus';
import { RoutedTabsComponent } from './routed-tabs.component';

describe(RoutedTabsComponent.name, () => {
  const eventSubject = new ReplaySubject<RouterEvent>(1);

  class NavigationFocusMockService {
    navigationEndEvents = eventSubject.asObservable();
  }

  const createHost = createHostFactory<RoutedTabsComponent>({
    component: RoutedTabsComponent,
    imports: [RouterTestingModule],
    providers: [
      { provide: NavigationFocusService, useClass: NavigationFocusMockService },
    ],
  });

  function setup<T extends { [key: string]: any }>(hostProps?: T) {
    const template = `<ngs-routed-tabs></ngs-routed-tabs>`;
    const spectator = createHost<T>(template, {
      hostProps,
    });

    return { spectator };
  }

  it('should create', () => {
    const { spectator } = setup();

    expect(spectator.component).toBeTruthy();
  });
});
