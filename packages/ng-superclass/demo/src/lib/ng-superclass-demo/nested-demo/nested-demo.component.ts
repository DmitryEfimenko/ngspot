import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CODE_SNIPPETS_DIRECTIVES,
  Snippet,
} from '@ngspot/common/code-snippets';
import { HighlightContentDirective } from '@ngspot/common/highlight-content';
import { NestedComponent } from '@ngspot/ng-superclass';

const consumerTs = require('raw-loader!./snippet-consumer.txt').default;
const nestedTs = require('raw-loader!./snippet-nested.txt').default;
const oneInputTs = require('raw-loader!./snippet-one-input.txt').default;

@Component({
  selector: 'ngs-nested-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CODE_SNIPPETS_DIRECTIVES,
    NestedComponent,
    HighlightContentDirective,
  ],
  templateUrl: './nested-demo.component.html',
  styleUrls: ['./nested-demo.component.scss'],
})
export class NestedDemoComponent {
  variant: 1 | 2 = 1;
  value: string;

  snippets: Record<string, Snippet | Snippet[]> = {
    nested: [
      {
        fileName: 'app.component.ts',
        content: consumerTs,
        language: 'typescript',
      },
      {
        fileName: 'nested.component.ts',
        content: nestedTs,
        language: 'typescript',
      },
      {
        fileName: 'one-input.component.ts',
        content: oneInputTs,
        language: 'typescript',
      },
    ],
  };
}
