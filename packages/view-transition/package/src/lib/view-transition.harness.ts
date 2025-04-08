import { ComponentHarness } from '@angular/cdk/testing';

import { ViewTransitionNameForPassiveShorthandHarness } from './testing/view-transition-name-for-passive.harness';

export class ViewTransitionRendererHarness extends ComponentHarness {
  static hostSelector = '[vt]'; // Matches elements with the vt directive

  vtNames = this.locatorForAll(ViewTransitionNameForPassiveShorthandHarness);
}
