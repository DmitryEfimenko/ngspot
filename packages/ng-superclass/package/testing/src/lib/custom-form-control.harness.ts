import { ComponentHarness } from '@angular/cdk/testing';

/**
 * Extend your custom component harness from this class. This will allow
 * using testCustomControlComponentCommons test utility function that tests
 * for common custom component behavior.
 */
export abstract class CustomFormControlHarness<
  ValueType
> extends ComponentHarness {
  abstract setValue(value: ValueType): Promise<void>;

  abstract touch(): Promise<void>;

  async isMarkedAs(state: 'touched' | 'dirty' | 'valid' | 'invalid') {
    const host = await this.host();
    return await host.hasClass(`ng-${state}`);
  }
}
