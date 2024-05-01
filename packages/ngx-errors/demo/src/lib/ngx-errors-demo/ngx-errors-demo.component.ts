import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEMO_MAIN_CONTENT_DECLARATIONS } from '@ngspot/common/demo-main-content';

import { ReactiveFormsDemoComponent } from './reactive-forms-demo/reactive-forms-demo.component';

@Component({
  selector: 'ngs-ngx-errors-demo',
  standalone: true,
  imports: [DEMO_MAIN_CONTENT_DECLARATIONS, ReactiveFormsDemoComponent],
  template: `
    <ngs-demo-main-content>
      <ngs-reactive-forms-demo></ngs-reactive-forms-demo>
    </ngs-demo-main-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxErrorsDemoComponent {}
