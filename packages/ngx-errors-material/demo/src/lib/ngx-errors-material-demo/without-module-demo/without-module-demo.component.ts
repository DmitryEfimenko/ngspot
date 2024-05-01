import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CODE_SNIPPETS_DIRECTIVES,
  Snippet,
} from '@ngspot/common/code-snippets';
import { ErrorsConfiguration, IErrorsConfiguration } from '@ngspot/ngx-errors';

import { WithoutModuleDemoResultComponent } from './without-module-demo-result.component';

declare const require: any;

const withoutModuleTs =
  require('raw-loader!./snippet-without-module.txt').default;

@Component({
  selector: 'ngs-without-module-demo',
  standalone: true,
  imports: [
    CODE_SNIPPETS_DIRECTIVES,
    WithoutModuleDemoResultComponent,
    JsonPipe,
  ],
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
      [snippets]="snippets['withoutModule']"
    >
      <ng-container *ngsSnippetDescription>

        This example demonstrates behavior of material error when NgxErrorsMaterialModule
        module is not used and custom error configuration is provided. Notice the use of
        the <pre>{{ configSample | json }}</pre> configuration. According to
        this configuration, the error should not be reported unless the input was
        modified by the user. However, just focusing on the input and un-focusing
        (marking input as touched) will change the color of the label to the error state
        while the error is not yet shown.

      </ng-container>

      <ng-container *ngsSnippetResult>
        <ngs-without-module-demo-result />
      </ng-container>
    </ngs-code-snippets>
  `,
})
export class WithoutModuleDemoComponent {
  configSample = { showErrorsWhenInput: 'dirty' };

  snippets: Record<string, Snippet | Snippet[]> = {
    withoutModule: [
      {
        fileName: 'app.component.ts',
        content: withoutModuleTs,
        language: 'typescript',
      },
    ],
  };
}
