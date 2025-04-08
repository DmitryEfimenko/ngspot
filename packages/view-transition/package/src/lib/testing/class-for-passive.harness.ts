import { ComponentHarness } from '@angular/cdk/testing';

export class ClassForPassiveHarness extends ComponentHarness {
  static hostSelector = '[vtClassForPassive]';

  async getClass(): Promise<string | null> {
    const element = await this.host();
    return (await element.getAttribute('class')) ?? '';
  }

  async hasClass(name: string): Promise<boolean> {
    const element = await this.host();
    return await element.hasClass(name);
  }
}
