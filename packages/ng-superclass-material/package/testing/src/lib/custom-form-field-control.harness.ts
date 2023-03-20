import { MatFormFieldHarness } from '@angular/material/form-field/testing';

/**
 * Extend your custom component harness from this class. This will allow
 * using testCustomControlComponentCommons test utility function that tests
 * for common custom component behavior.
 */
export abstract class CustomFormFieldControlHarness<
  ValueType
> extends MatFormFieldHarness {
  abstract setValue(value: ValueType): Promise<void>;

  abstract touch(): Promise<void>;

  async isMarkedAs(state: 'touched' | 'dirty' | 'valid' | 'invalid') {
    const host = await this.host();
    return await host.hasClass(`ng-${state}`);
  }
}
