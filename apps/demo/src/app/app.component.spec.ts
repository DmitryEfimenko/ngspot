import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory } from '@ngneat/spectator';
import { MockBuilder } from 'ng-mocks';
import { HighlightLoader } from 'ngx-highlightjs';

import { AppComponent } from './app.component';
import { customIconsProviders } from './shared/custom-icons';
import { FakeMediaMatcherProvider } from './test-utils';

describe(AppComponent.name, () => {
  const deps = MockBuilder([RouterTestingModule])
    .provide(FakeMediaMatcherProvider)
    .provide(customIconsProviders)
    .mock(HighlightLoader)
    .build();

  const createComponent = createComponentFactory({
    component: AppComponent,
    disableAnimations: true,
    ...deps,
  });

  function setup() {
    const spectator = createComponent();

    return { spectator };
  }

  it('should create the app', () => {
    const { spectator } = setup();
    expect(spectator.component).toBeTruthy();
  });
});
