import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CODE_SNIPPETS_DIRECTIVES, Snippet } from '@ngspot/common';
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  EXPANDABLE_INPUT_DIRECTIVES,
  gap,
  smoothHorizontalCollapse,
} from '@ngspot/expandable-input';

const basic = require('raw-loader!./snippets/basic.html').default;
const withAction =
  require('raw-loader!./snippets/with-action-button.html').default;
const hidingSiblingHtml =
  require('raw-loader!./snippets/hiding-sibling-element-html.html').default;
const hidingSiblingTs =
  require('raw-loader!./snippets/hiding-sibling-element-ts.txt').default;

@Component({
  selector: 'ngs-expandable-input-basic-demo',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    EXPANDABLE_INPUT_DIRECTIVES,
    CODE_SNIPPETS_DIRECTIVES,
  ],
  animations: [
    smoothHorizontalCollapse({
      durationMs: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    }),
    gap({
      gapAmount: '1rem',
      durationMs: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    }),
  ],
})
export class NgsExpandableBasicDemoComponent {
  snippets: Record<string, Snippet | Snippet[]> = {
    basic: { fileName: 'HTML', content: basic },
    withAction: { fileName: 'HTML', content: withAction },
    hidingSibling: [
      { fileName: 'HTML', content: hidingSiblingHtml },
      { fileName: 'TS', content: hidingSiblingTs },
    ],
  };
}
