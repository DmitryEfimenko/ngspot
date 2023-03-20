import { DOCUMENT } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { createHostFactory } from '@ngneat/spectator';

import { TableOfContentsComponent } from './table-of-contents.component';

describe(TableOfContentsComponent.name, () => {
  const createHost = createHostFactory<TableOfContentsComponent>({
    component: TableOfContentsComponent,
    imports: [RouterTestingModule],
    providers: [{ provide: DOCUMENT, useValue: document }],
  });

  function setup<T extends { [key: string]: any }>(hostProps?: T) {
    const template = `<ngs-table-of-contents></ngs-table-of-contents>`;
    const spectator = createHost<T>(template, { hostProps });

    return { spectator };
  }

  it('should create', () => {
    const { spectator } = setup();
    expect(spectator.component).toBeTruthy();
  });
});
