import { ComponentHarness } from '@angular/cdk/testing';

import { OneInputHarness } from './one-input.harness';
import { TwoInputsHarness } from './two-inputs.harness';

export class NestedHarness extends ComponentHarness {
  static hostSelector = 'ngs-nested';

  oneInput = this.locatorForOptional(OneInputHarness);
  twoInputs = this.locatorForOptional(TwoInputsHarness);

  async value() {
    const oneInput = await this.oneInput();
    if (oneInput) {
      return await oneInput.value();
    }

    const twoInputs = await this.twoInputs();
    if (twoInputs) {
      return await twoInputs.value();
    }

    throw new Error('No inputs');
  }

  async setValue(value: string) {
    const oneInput = await this.oneInput();
    if (oneInput) {
      await oneInput.setValue(value);
    }

    const twoInputs = await this.twoInputs();
    if (twoInputs) {
      await twoInputs.setValue(value);
    }
  }

  async touch() {
    const oneInput = await this.oneInput();
    if (oneInput) {
      await oneInput.touch();
    }

    const twoInputs = await this.twoInputs();
    if (twoInputs) {
      await twoInputs.touch();
    }
  }

  async isHostMarkedAs(state: 'touched' | 'dirty' | 'valid' | 'invalid') {
    const host = await this.host();
    return await host.hasClass(`ng-${state}`);
  }
}
