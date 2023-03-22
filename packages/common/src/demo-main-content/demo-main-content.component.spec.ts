import { createComponentFactory } from '@ngneat/spectator';
import { TableOfContentsComponent } from '@ngspot/table-of-contents';
import { MockBuilder } from 'ng-mocks';

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
