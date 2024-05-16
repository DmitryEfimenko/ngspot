import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CODE_SNIPPETS_DIRECTIVES,
  Snippet,
} from '@ngspot/common/code-snippets';

import { ErrorContextResultComponent } from './error-context-result.component';

declare const require: any;

const snippetTs = require('raw-loader!./snippet.txt').default;

@Component({
  selector: 'ngs-error-context',
  standalone: true,
  imports: [CODE_SNIPPETS_DIRECTIVES, ErrorContextResultComponent, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-code-snippets
      header="Multiple errors for the field"
      [snippets]="snippets['context']"
      [expanded]="false"
    >
      <ng-container *ngsSnippetDescription>
        This example demonstrates accessing the error details
      </ng-container>

      <ng-container *ngsSnippetResult>
        <ngs-error-context-result />
      </ng-container>
    </ngs-code-snippets>
  `,
})
export class ErrorContextComponent {
  snippets: Record<string, Snippet | Snippet[]> = {
    context: [
      {
        fileName: 'app.component.ts',
        content: snippetTs,
        language: 'typescript',
      },
    ],
  };
}
