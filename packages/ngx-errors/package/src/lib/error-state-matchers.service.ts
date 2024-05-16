import { Injectable, inject } from '@angular/core';

import {
  CUSTOM_ERROR_STATE_MATCHERS,
  IErrorStateMatcher,
} from './custom-error-state-matchers';
import {
  ShowOnDirtyErrorStateMatcher,
  ShowOnSubmittedErrorStateMatcher,
  ShowOnTouchedAndDirtyErrorStateMatcher,
  ShowOnTouchedErrorStateMatcher,
} from './error-state-matchers';

export type ProvidedErrorStateMatcherKeys =
  | 'touched'
  | 'dirty'
  | 'touchedAndDirty'
  | 'formIsSubmitted';

export type MatchersKeys = ProvidedErrorStateMatcherKeys | string;

@Injectable({ providedIn: 'root' })
export class ErrorStateMatchers {
  private showOnTouchedErrorStateMatcher = inject(
    ShowOnTouchedErrorStateMatcher,
  );
  private showOnDirtyErrorStateMatcher = inject(ShowOnDirtyErrorStateMatcher);
  private showOnTouchedAndDirtyErrorStateMatcher = inject(
    ShowOnTouchedAndDirtyErrorStateMatcher,
  );
  private showOnSubmittedErrorStateMatcher = inject(
    ShowOnSubmittedErrorStateMatcher,
  );
  private customErrorStateMatchers = inject(CUSTOM_ERROR_STATE_MATCHERS, {
    optional: true,
  });

  private matchers: { [key: string]: IErrorStateMatcher } = {
    touched: this.showOnTouchedErrorStateMatcher,
    dirty: this.showOnDirtyErrorStateMatcher,
    touchedAndDirty: this.showOnTouchedAndDirtyErrorStateMatcher,
    formIsSubmitted: this.showOnSubmittedErrorStateMatcher,
  };

  constructor() {
    if (this.customErrorStateMatchers) {
      this.matchers = { ...this.matchers, ...this.customErrorStateMatchers };
    }
  }

  get(showWhen: string): IErrorStateMatcher | undefined {
    return this.matchers[showWhen];
  }

  validKeys(): string[] {
    return Object.keys(this.matchers);
  }
}
