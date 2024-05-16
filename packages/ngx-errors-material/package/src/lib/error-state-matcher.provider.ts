import { Provider } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';

import {
  ERROR_CONFIGURATION,
  ErrorsConfiguration,
  ErrorStateMatchers,
} from '@ngspot/ngx-errors';

export const errorStateMatcherProvider: Provider = {
  provide: ErrorStateMatcher,
  useFactory: (
    errorsConfiguration: ErrorsConfiguration,
    errorStateMatchers: ErrorStateMatchers,
  ) => {
    return errorStateMatchers.get(errorsConfiguration.showErrorsWhenInput);
  },
  deps: [ERROR_CONFIGURATION, ErrorStateMatchers],
};
