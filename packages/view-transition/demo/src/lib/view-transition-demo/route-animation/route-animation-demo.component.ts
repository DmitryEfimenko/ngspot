import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { VIEW_TRANSITION_DECLARATIONS } from '@ngspot/view-transition';

import { imagesMetadata } from './data';

@Component({
  selector: 'ngs-vt-route-animation-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    NgOptimizedImage,
    RouterLink,
    VIEW_TRANSITION_DECLARATIONS,
  ],
  templateUrl: './route-animation-demo.component.html',
  styleUrls: ['./route-animation-demo.component.scss'],
})
export class ViewTransitionRouteAnimationDemoComponent {
  imagesMetadata = imagesMetadata;
}
