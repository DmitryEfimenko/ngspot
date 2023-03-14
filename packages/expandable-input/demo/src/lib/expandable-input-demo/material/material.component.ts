import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import {
  CODE_SNIPPETS_DIRECTIVES,
  Snippet,
} from '@ngspot/common/code-snippets';
import {
  animateCssProperty,
  ANIMATION_DURATION,
  ANIMATION_EASING,
  EXPANDABLE_INPUT_DIRECTIVES,
  smoothHorizontalCollapse,
} from '@ngspot/expandable-input';

import { iconCloseAnimation, iconOpenAnimation } from './icon-animations';
import { MaterialExpandableInputComponent } from './material-expandable-input/material-expandable-input.component';

const basic = {
  html: require('raw-loader!./snippets/basic-html.html').default,
  css: require('raw-loader!./snippets/basic-css.txt').default,
};

const reusable = {
  consume: require('raw-loader!./snippets/reusable-consume-html.html').default,
  compHtml: require('raw-loader!./snippets/reusable-comp-html.html').default,
  compTs: require('raw-loader!./snippets/reusable-comp-ts.txt').default,
  compCss: require('raw-loader!./snippets/reusable-comp-css.txt').default,
  animations: require('raw-loader!./snippets/reusable-animations.txt').default,
};

const withAction = {
  html: require('raw-loader!./snippets/with-action-button-html.html').default,
  css: require('raw-loader!./snippets/with-action-button-css.txt').default,
};

const hidingSibling = {
  html: require('raw-loader!./snippets/hiding-sibling-element.html').default,
  ts: require('raw-loader!./snippets/hiding-sibling-element-ts.txt').default,
  css: require('raw-loader!./snippets/hiding-sibling-element-css.txt').default,
};

@Component({
  selector: 'ngs-expandable-input-material-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    EXPANDABLE_INPUT_DIRECTIVES,
    CODE_SNIPPETS_DIRECTIVES,
    MaterialExpandableInputComponent,
  ],
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    smoothHorizontalCollapse({
      durationMs: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    }),
    animateCssProperty({
      propName: 'gap',
      falseValue: '1rem',
      trueValue: '0',
      durationMs: ANIMATION_DURATION,
      easing: ANIMATION_EASING,
    }),
  ],
})
export class NgsExpandableMaterialDemoComponent {
  iconOpenAnimation = iconOpenAnimation;
  iconCloseAnimation = iconCloseAnimation;

  snippets: Record<string, Snippet | Snippet[]> = {
    basic: [
      { fileName: 'HTML', content: basic.html, language: 'xml' },
      { fileName: 'SCSS', content: basic.css, language: 'css' },
    ],
    reusable: [
      { fileName: 'HTML', content: reusable.consume, language: 'xml' },
      {
        fileName: 'material-expandable-input.component.ts',
        content: reusable.compTs,
        language: 'typescript',
      },
      {
        fileName: 'material-expandable-input.component.html',
        content: reusable.compHtml,
        language: 'xml',
      },
      {
        fileName: 'icon-animations.ts',
        content: reusable.animations,
        language: 'typescript',
      },
      {
        fileName: 'material-expandable-input.component.scss',
        content: reusable.compCss,
        language: 'css',
      },
    ],
    withAction: [
      { fileName: 'HTML', content: withAction.html, language: 'xml' },
      { fileName: 'SCSS', content: withAction.css, language: 'css' },
    ],
    hidingSibling: [
      { fileName: 'HTML', content: hidingSibling.html, language: 'xml' },
      { fileName: 'TS', content: hidingSibling.ts, language: 'typescript' },
      { fileName: 'SCSS', content: hidingSibling.css, language: 'css' },
    ],
  };
}
