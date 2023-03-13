import { CustomFormControlHarness } from '@ngspot/ng-superclass/testing';

export class TwoInputsHarness extends CustomFormControlHarness<string> {
  static hostSelector = 'ngs-two-inputs';

  input1El = this.locatorFor('input[name="inp1"]');
  input2El = this.locatorFor('input[name="inp2"]');

  async value() {
    const input1El = await this.input1El();
    const input2El = await this.input2El();
    const val1 = (await input1El.getProperty('value')) as string;
    const val2 = (await input2El.getProperty('value')) as string;
    return val1 + val2;
  }

  async setValue(newValue: string) {
    const input1El = await this.input1El();
    const input2El = await this.input2El();

    await input1El.clear();
    await input2El.clear();
    // We don't want to send keys for the value if the value is an empty
    // string in order to clear the value. Sending keys with an empty string
    // still results in unnecessary focus events.
    if (newValue) {
      const val1 = newValue.substring(0, 3);
      const val2 = newValue.substring(3, newValue.length);
      if (val1) {
        await input1El.sendKeys(val1);
      }
      if (val2) {
        await input2El.sendKeys(val2);
      }
    }
  }

  async touch() {
    const inputEl = await this.input1El();
    await inputEl.focus();
    await inputEl.blur();
  }
}
