import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEMO_MAIN_CONTENT_DECLARATIONS } from '@ngspot/common/demo-main-content';

import { WithModuleDemoComponent } from './with-module-demo/with-module-demo.component';
import { WithoutModuleDemoComponent } from './without-module-demo/without-module-demo.component';

@Component({
  selector: 'ngs-ngx-errors-demo',
  standalone: true,
  imports: [
    DEMO_MAIN_CONTENT_DECLARATIONS,
    WithoutModuleDemoComponent,
    WithModuleDemoComponent,
  ],
  template: `
    <ngs-demo-main-content>
      <ngs-without-module-demo></ngs-without-module-demo>
      <ngs-with-module-demo></ngs-with-module-demo>
    </ngs-demo-main-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxErrorsMaterialDemoComponent {}
