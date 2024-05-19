import { FormFieldAsNgxErrorsDirective } from './form-field-as-ngx-errors.directive';
import {
  TempErrorDirective,
  TempErrorsDirective,
  TempNgxErrorsFormDirective,
} from './ngx-errors-type-re-exports';
import { SetMatInputErrorStateMatcherDirective } from './set-mat-input-error-state-matcher.directive';

export const NGX_ERRORS_MATERIAL_DECLARATIONS = [
  SetMatInputErrorStateMatcherDirective,
  FormFieldAsNgxErrorsDirective,
  // including temp versions of the original directives to get around issue:
  // https://github.com/angular/angular/issues/48089
  TempErrorDirective,
  TempErrorsDirective,
  TempNgxErrorsFormDirective,
] as const;
