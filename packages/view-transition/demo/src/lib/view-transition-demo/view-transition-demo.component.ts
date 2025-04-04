import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DEMO_MAIN_CONTENT_DECLARATIONS } from '@ngspot/common/demo-main-content';
import { ROUTED_TABS_DECLARATIONS } from '@ngspot/common/routed-tabs';

import { ViewTransitionBasicDemoComponent } from './basic/basic-demo.component';
import { ViewTransitionCardsDemoComponent } from './cards/cards-demo.component';
import { ViewTransitionIsotopeDemoComponent } from './isotope/isotope-demo.component';
import { ViewTransitionOrderingDemoComponent } from './ordering/ordering-demo.component';

@Component({
  selector: 'ngs-ngx-errors-demo',
  standalone: true,
  imports: [
    DEMO_MAIN_CONTENT_DECLARATIONS,
    ROUTED_TABS_DECLARATIONS,
    ViewTransitionBasicDemoComponent,
    ViewTransitionCardsDemoComponent,
    ViewTransitionIsotopeDemoComponent,
    ViewTransitionOrderingDemoComponent,
    RouterOutlet,
  ],
  template: `
    <ngs-routed-tabs>
      <ng-container *ngsRoutedTab="'basic'; label: 'Basic'">
        <ngs-demo-main-content>
          <ngs-vt-basic-demo />
        </ngs-demo-main-content>
      </ng-container>

      <ng-container *ngsRoutedTab="'cards'; label: 'Cards'">
        <ngs-demo-main-content>
          https://view-transitions.chrome.dev/cards/spa/
          <ngs-vt-cards-demo />
        </ngs-demo-main-content>
      </ng-container>

      <ng-container *ngsRoutedTab="'ordering'; label: 'Ordering'">
        <ngs-demo-main-content>
          <ngs-vt-ordering-demo />
        </ngs-demo-main-content>
      </ng-container>

      <ng-container *ngsRoutedTab="'isotope'; label: 'Isotope'">
        <ngs-demo-main-content>
          <ngs-vt-isotope-demo />
        </ngs-demo-main-content>
      </ng-container>

      <ng-container *ngsRoutedTab="'route-animation'; label: 'Route Animation'">
        <ngs-demo-main-content>
          <router-outlet></router-outlet>
        </ngs-demo-main-content>
      </ng-container>
    </ngs-routed-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewTransitionDemoComponent {
  position = signal<'left' | 'right'>('left');

  toggleShape() {
    this.position.set(this.position() === 'left' ? 'right' : 'left');
  }
}
