import { Directive } from '@angular/core';

import {
  ErrorDirective,
  ErrorsDirective,
  NgxErrorsBase,
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
  providers: [{ provide: NgxErrorsBase, useExisting: TempErrorsDirective }],
})
export class TempErrorsDirective extends ErrorsDirective {}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'form',
  exportAs: 'ngxErrorsForm',
  standalone: true,
  providers: [
    {
      provide: NgxErrorsFormDirective,
      useExisting: TempNgxErrorsFormDirective,
    },
  ],
})
export class TempNgxErrorsFormDirective extends NgxErrorsFormDirective {}
