import { CustomFormControlHarness } from '@ngspot/ng-superclass/testing';

export class FullNameHarness extends CustomFormControlHarness<string> {
  static hostSelector = 'ngs-full-name';

  firstNameEl = this.locatorFor('input[name="firstName"]');
  lastNameEl = this.locatorFor('input[name="lastName"]');

  async value() {
    const firstNameEl = await this.firstNameEl();
    const lastNameEl = await this.lastNameEl();
    const firstName = await firstNameEl.getProperty<string>('value');
    const lastName = await lastNameEl.getProperty<string>('value');
    let result = '';
    if (firstName) {
      result += firstName;
    }
    if (lastName) {
      result += ` ${lastName}`;
    }
    return result;
  }

  async setValue(fullName: string) {
    const firstNameEl = await this.firstNameEl();
    const lastNameEl = await this.lastNameEl();

    await firstNameEl.clear();
    await lastNameEl.clear();
    // We don't want to send keys for the value if the value is an empty
    // string in order to clear the value. Sending keys with an empty string
    // still results in unnecessary focus events.
    if (fullName) {
      const [firstName, lastName] = fullName.split(' ');

      if (firstName) {
        await firstNameEl.sendKeys(firstName);
      }
      if (lastName) {
        await lastNameEl.sendKeys(lastName);
      }
    }
  }

  async touch() {
    const inputEl = await this.firstNameEl();
    await inputEl.focus();
    await inputEl.blur();
  }
}
