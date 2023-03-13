import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEMO_MAIN_CONTENT_DECLARATIONS } from '@ngspot/common/demo-main-content';
import { CounterDemoComponent } from './counter-demo/counter-demo.component';
import { FullNameDemoComponent } from './full-name-demo/full-name-demo.component';
import { NestedDemoComponent } from './nested-demo/nested-demo.component';

@Component({
  selector: 'ngs-ng-superclass-demo',
  standalone: true,
  imports: [
    CommonModule,
    DEMO_MAIN_CONTENT_DECLARATIONS,
    CounterDemoComponent,
    FullNameDemoComponent,
    NestedDemoComponent,
  ],
  templateUrl: './ng-superclass-demo.component.html',
  styleUrls: ['./ng-superclass-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgSuperclassDemoComponent {}
