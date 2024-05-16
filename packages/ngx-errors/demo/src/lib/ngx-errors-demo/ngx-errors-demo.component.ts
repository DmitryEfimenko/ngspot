import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEMO_MAIN_CONTENT_DECLARATIONS } from '@ngspot/common/demo-main-content';

import { ErrorContextComponent } from './error-context/error-context.component';
import { PasswordDemoComponent } from './password-demo/password-demo.component';
import { ReactiveFormsDemoComponent } from './reactive-forms-demo/reactive-forms-demo.component';

@Component({
  selector: 'ngs-ngx-errors-demo',
  standalone: true,
  imports: [
    DEMO_MAIN_CONTENT_DECLARATIONS,
    ReactiveFormsDemoComponent,
    PasswordDemoComponent,
    ErrorContextComponent,
  ],
  styles: [
    `
      ::ng-deep input {
        color: black;
      }
    `,
  ],
  template: `
    <ngs-demo-main-content>
      <ngs-reactive-forms-demo></ngs-reactive-forms-demo>
      <ngs-password-demo></ngs-password-demo>
      <ngs-error-context></ngs-error-context>
    </ngs-demo-main-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxErrorsDemoComponent {}
