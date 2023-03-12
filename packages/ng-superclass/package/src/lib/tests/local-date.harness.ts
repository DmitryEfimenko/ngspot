import { CustomFormControlHarness } from '@ngspot/ng-superclass/testing';

export class LocalDateHarness extends CustomFormControlHarness<string> {
  static hostSelector = 'ngs-local-date';

  inputEl = this.locatorFor('input');

  // eslint-disable-next-line @typescript-eslint/require-await
  async setValue() {
    // input of type datetime-local does not support typing via sending keys to it.
    throw new Error('Use `spectator.component.viewModel.setValue()` instead');
  }

  async value() {
    const inputEl = await this.inputEl();
    const value = await inputEl.getProperty('value');
    return value as string;
  }

  async touch() {
    const inputEl = await this.inputEl();
    await inputEl.focus();
    await inputEl.blur();
  }
}
