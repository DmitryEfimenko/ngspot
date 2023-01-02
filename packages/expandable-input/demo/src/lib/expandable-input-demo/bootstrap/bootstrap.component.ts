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

const basicHtml = require('raw-loader!./snippets/basic-html.html').default;
const basicCss = require('raw-loader!./snippets/basic-css.txt').default;
const withActionHtml =
  require('raw-loader!./snippets/with-action-button-html.html').default;
const withActionCss =
  require('raw-loader!./snippets/with-action-button-css.txt').default;
const hidingSiblingHtml =
  require('raw-loader!./snippets/hiding-sibling-element.html').default;
const hidingSiblingTs =
  require('raw-loader!./snippets/hiding-sibling-element-ts.txt').default;
const hidingSiblingCss =
  require('raw-loader!./snippets/hiding-sibling-element-css.txt').default;

@Component({
  selector: 'ngs-expandable-input-bootstrap-demo',
  templateUrl: './bootstrap.component.html',
  styleUrls: ['./bootstrap.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    EXPANDABLE_INPUT_DIRECTIVES,
    CODE_SNIPPETS_DIRECTIVES,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class NgsExpandableBootstrapDemoComponent {
  snippets: Record<string, Snippet | Snippet[]> = {
    basic: [
      { fileName: 'HTML', content: basicHtml },
      { fileName: 'SCSS', content: basicCss },
    ],
    withAction: [
      { fileName: 'HTML', content: withActionHtml },
      { fileName: 'SCSS', content: withActionCss },
    ],
    hidingSibling: [
      { fileName: 'HTML', content: hidingSiblingHtml },
      { fileName: 'TS', content: hidingSiblingTs },
      { fileName: 'SCSS', content: hidingSiblingCss },
    ],
  };
}