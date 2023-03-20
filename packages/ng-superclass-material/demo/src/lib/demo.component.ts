import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DEMO_MAIN_CONTENT_DECLARATIONS } from '@ngspot/common/demo-main-content';

import { TelDemoComponent } from './tel-demo/tel-demo.component';

@Component({
  selector: 'ngs-ng-superclass-material-demo',
  standalone: true,
  imports: [CommonModule, DEMO_MAIN_CONTENT_DECLARATIONS, TelDemoComponent],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgSuperclassMaterialDemoComponent {}
