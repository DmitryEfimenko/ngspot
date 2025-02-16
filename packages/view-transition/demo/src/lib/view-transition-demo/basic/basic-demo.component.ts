import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { VIEW_TRANSITION_DIRECTIVES } from '@ngspot/view-transition';

@Component({
  selector: 'ngs-vt-basic-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [...VIEW_TRANSITION_DIRECTIVES, MatButtonModule],
  styleUrl: './basic-demo.component.scss',
  templateUrl: './basic-demo.component.html',
})
export class ViewTransitionBasicDemoComponent {
  position = signal<'left' | 'right'>('left');

  toggleShape() {
    this.position.set(this.position() === 'left' ? 'right' : 'left');
  }
}
