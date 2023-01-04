import { Component } from '@angular/core';
import { createHostFactory } from '@ngneat/spectator';

import { ExpandableInputComponent } from './expandable-input.component';
import { EXPANDABLE_INPUT_DIRECTIVES } from './expandable-input.module';

@Component({
  selector: 'ngs-test',
  template: `
    <ngs-expandable-input>
      <input type="text" *ngsExpInput />
      <i *ngsExpIconOpen>🔍</i>
      <i *ngsExpIconClose>✖️</i>
    </ngs-expandable-input>
  `,
  standalone: true,
  imports: [EXPANDABLE_INPUT_DIRECTIVES],
})
export class TestComponent {}

describe(ExpandableInputComponent.name, () => {
  const createHostComponent = createHostFactory({
    component: ExpandableInputComponent,
    imports: [EXPANDABLE_INPUT_DIRECTIVES],
  });

  function setup() {
    const template = `
    <ngs-expandable-input>
      <input type="text" *ngsExpInput />
      <i *ngsExpIconOpen>🔍</i>
      <i *ngsExpIconClose>✖️</i>
    </ngs-expandable-input>`;
    const spectator = createHostComponent(template);

    return { spectator };
  }

  it('should create', () => {
    const { spectator } = setup();
    expect(spectator.component).toBeTruthy();
  });
});
