import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TableOfContentsComponent } from '@ngspot/table-of-contents';

@Component({
  selector: 'ngs-demo-main-content',
  standalone: true,
  imports: [CommonModule, TableOfContentsComponent],
  templateUrl: './demo-main-content.component.html',
  styleUrls: ['./demo-main-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoMainContentComponent {}
