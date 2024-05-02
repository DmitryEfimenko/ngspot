import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CODE_SNIPPETS_DIRECTIVES,
  Snippet,
} from '@ngspot/common/code-snippets';
import { ErrorsConfiguration, IErrorsConfiguration } from '@ngspot/ngx-errors';

import { WithModuleDemoResultComponent } from './with-module-demo-result.component';

declare const require: any;

const withModuleTs = require('raw-loader!./snippet-with-module.txt').default;

@Component({
  selector: 'ngs-with-module-demo',
  standalone: true,
  imports: [CODE_SNIPPETS_DIRECTIVES, WithModuleDemoResultComponent, JsonPipe],
  providers: [
    {
      provide: ErrorsConfiguration,
      useValue: <IErrorsConfiguration>{ showErrorsWhenInput: 'dirty' },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngs-code-snippets
      title="Without NgxErrorsMaterialModule module"
      [snippets]="snippets['withModule']"
    >
      <ng-container *ngsSnippetDescription>

        This example demonstrates behavior of material error when NgxErrorsMaterialModule
        module is used and custom error configuration is provided. Notice the use of
        the <pre>{{ configSample | json }}</pre> configuration. According to
        this configuration, the error should not be reported unless the input was
        modified by the user. Now, because NgxErrorsMaterialModule is used, just focusing
        on the input and un-focusing (marking input as touched) will NOT change the color
        of the label to the error state while the error is not yet shown.
      </ng-container>

      <ng-container *ngsSnippetResult>
        <ngs-with-module-demo-result />
      </ng-container>
    </ngs-code-snippets>
  `,
})
export class WithModuleDemoComponent {
  configSample = { showErrorsWhenInput: 'dirty' };

  snippets: Record<string, Snippet | Snippet[]> = {
    withModule: [
      {
        fileName: 'app.component.ts',
        content: withModuleTs,
        language: 'typescript',
      },
    ],
  };
}