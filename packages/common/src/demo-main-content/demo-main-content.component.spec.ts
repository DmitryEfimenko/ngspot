import { createComponentFactory } from '@ngneat/spectator';
import { MockBuilder } from 'ng-mocks';

import { TableOfContentsComponent } from '../table-of-contents/table-of-contents';
import { DemoMainContentComponent } from './demo-main-content.component';

describe(DemoMainContentComponent.name, () => {
  const config = MockBuilder(DemoMainContentComponent)
    .mock(TableOfContentsComponent)
    .build();

  const createComponent = createComponentFactory({
    component: DemoMainContentComponent,
    ...config,
  });

  function setup() {
    const spectator = createComponent();

    return { spectator };
  }

  it('should create', () => {
    const { spectator } = setup();
    expect(spectator.component).toBeTruthy();
  });
});
