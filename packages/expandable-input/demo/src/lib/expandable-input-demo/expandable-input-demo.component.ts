import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEMO_MAIN_CONTENT_DECLARATIONS } from '@ngspot/common';
import { NgsExpandableBasicDemoComponent } from './basic/basic.component';

import { ROUTED_TABS_DECLARATIONS } from '@ngspot/common';
import { NgsExpandableBootstrapDemoComponent } from './bootstrap/bootstrap.component';
import { NgsExpandableMaterialDemoComponent } from './material/material.component';

@Component({
  selector: 'ngs-expandable-input-demo',
  standalone: true,
  templateUrl: './expandable-input-demo.component.html',
  styleUrls: ['./expandable-input-demo.component.scss'],
  imports: [
    CommonModule,
    NgsExpandableBasicDemoComponent,
    NgsExpandableMaterialDemoComponent,
    NgsExpandableBootstrapDemoComponent,
    ROUTED_TABS_DECLARATIONS,
    DEMO_MAIN_CONTENT_DECLARATIONS,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableInputDemoComponent {}
