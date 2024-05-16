import { NGX_ERRORS_DECLARATIONS } from '@ngspot/ngx-errors';

import { FormFieldAsNgxErrorsDirective } from './form-field-as-ngx-errors.directive';
import { SetMatInputErrorStateMatcherDirective } from './set-mat-input-error-state-matcher.directive';

export const NGX_ERRORS_MATERIAL_DECLARATIONS = [
  SetMatInputErrorStateMatcherDirective,
  FormFieldAsNgxErrorsDirective,
  ...NGX_ERRORS_DECLARATIONS,
] as const;

export { provideNgxErrorsConfig } from '@ngspot/ngx-errors';
