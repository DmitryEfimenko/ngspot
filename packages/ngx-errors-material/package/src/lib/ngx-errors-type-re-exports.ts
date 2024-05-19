import { Directive } from '@angular/core';

import {
  ErrorDirective,
  ErrorsDirective,
  NgxErrorsFormDirective,
} from '@ngspot/ngx-errors';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngxError]',
  exportAs: 'ngxError',
  standalone: true,
})
export class TempErrorDirective extends ErrorDirective {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngxErrors]',
  exportAs: 'ngxErrors',
  standalone: true,
})
export class TempErrorsDirective extends ErrorsDirective {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'form',
  exportAs: 'ngxErrorsForm',
  standalone: true,
})
export class TempNgxErrorsFormDirective extends NgxErrorsFormDirective {}
