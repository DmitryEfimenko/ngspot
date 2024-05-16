import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CODE_SNIPPETS_DIRECTIVES,
  Snippet,
} from '@ngspot/common/code-snippets';

import { PasswordDemoResultComponent } from './password-demo-result.component';

declare const require: any;

const snippetTs = require('raw-loader!./snippet.txt').default;

@Component({
  selector: 'ngs-password-demo',
  standalone: true,
  imports: [CODE_SNIPPETS_DIRECTIVES, PasswordDemoResultComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-code-snippets
      header="Multiple errors for the field"
      [snippets]="snippets['password']"
      [expanded]="false"
    >
      <ng-container *ngsSnippetDescription>
        This example demonstrates the use of multiple errors
      </ng-container>

      <ng-container *ngsSnippetResult>
        <ngs-password-demo-result />
      </ng-container>
    </ngs-code-snippets>
  `,
})
export class PasswordDemoComponent {
  snippets: Record<string, Snippet | Snippet[]> = {
    password: [
      {
        fileName: 'app.component.ts',
        content: snippetTs,
        language: 'typescript',
      },
    ],
  };
}
