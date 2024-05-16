import { ErrorDirective } from './error.directive';
import { ErrorsDirective } from './errors.directive';
import { NgxErrorsFormDirective } from './form.directive';

export const NGX_ERRORS_DECLARATIONS = [
  ErrorsDirective,
  ErrorDirective,
  NgxErrorsFormDirective,
] as const;
