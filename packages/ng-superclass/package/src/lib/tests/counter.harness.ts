import { ComponentHarness } from '@angular/cdk/testing';

export class CounterHarness extends ComponentHarness {
  static hostSelector = 'ngs-counter';

  buttonEl = this.locatorFor('button');

  async value() {
    const buttonEl = await this.buttonEl();
    return await buttonEl.text();
  }

  async increment() {
    const buttonEl = await this.buttonEl();
    await buttonEl.click();
  }

  async visitButton() {
    const buttonEl = await this.buttonEl();
    await buttonEl.focus();
    await buttonEl.blur();
  }

  async isHostMarkedAs(state: 'touched' | 'dirty' | 'valid' | 'invalid') {
    const host = await this.host();
    return await host.hasClass(`ng-${state}`);
  }
}
