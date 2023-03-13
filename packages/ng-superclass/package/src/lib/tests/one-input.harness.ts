import { CustomFormControlHarness } from '@ngspot/ng-superclass/testing';

export class OneInputHarness extends CustomFormControlHarness<string> {
  static hostSelector = 'ngs-one-input';

  inputEl = this.locatorFor('input');

  async value() {
    const inputEl = await this.inputEl();
    const value = await inputEl.getProperty('value');
    return value as string;
  }

  async setValue(newValue: string) {
    const inputEl = await this.inputEl();
    await inputEl.clear();
    // We don't want to send keys for the value if the value is an empty
    // string in order to clear the value. Sending keys with an empty string
    // still results in unnecessary focus events.
    if (newValue) {
      await inputEl.sendKeys(newValue);
    }
  }

  async touch() {
    const inputEl = await this.inputEl();
    await inputEl.focus();
    await inputEl.blur();
  }
}
