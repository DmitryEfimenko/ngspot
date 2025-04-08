import { ComponentHarness } from '@angular/cdk/testing';

export class ViewTransitionNameForPassiveShorthandHarness extends ComponentHarness {
  static hostSelector = '[vtName]';

  async getViewTransitionName(): Promise<string | null> {
    const element = await this.host();
    return element.getCssValue('view-transition-name');
  }

  async hasViewTransitionName(name: string): Promise<boolean> {
    const currentName = await this.getViewTransitionName();
    return currentName === name;
  }
}
