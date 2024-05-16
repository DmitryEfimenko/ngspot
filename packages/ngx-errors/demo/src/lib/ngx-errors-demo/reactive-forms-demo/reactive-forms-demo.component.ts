import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
  CODE_SNIPPETS_DIRECTIVES,
  Snippet,
} from '@ngspot/common/code-snippets';

import { ReactiveFormsDemoResultComponent } from './reactive-forms-demo-result.component';

declare const require: any;

const reactiveFormTs = require('raw-loader!./snippet.txt').default;

@Component({
  selector: 'ngs-reactive-forms-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CODE_SNIPPETS_DIRECTIVES,
    ReactiveFormsDemoResultComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-code-snippets header="Reactive Form" [snippets]="snippets['form']">
      <ng-container *ngsSnippetResult>
        <ngs-reactive-forms-demo-result />
      </ng-container>
    </ngs-code-snippets>
  `,
})
export class ReactiveFormsDemoComponent {
  snippets: Record<string, Snippet | Snippet[]> = {
    form: [
      {
        fileName: 'app.component.ts',
        content: reactiveFormTs,
        language: 'typescript',
      },
    ],
  };
}
