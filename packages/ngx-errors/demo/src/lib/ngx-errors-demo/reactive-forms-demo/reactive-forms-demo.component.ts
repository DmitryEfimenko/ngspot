import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  CODE_SNIPPETS_DIRECTIVES,
  Snippet,
} from '@ngspot/common/code-snippets';
import { NgxErrorsModule } from '@ngspot/ngx-errors';

declare const require: any;

const reactiveFormTs =
  require('raw-loader!./snippet-reactive-form.txt').default;

@Component({
  selector: 'ngs-reactive-forms-demo',
  standalone: true,
  imports: [ReactiveFormsModule, CODE_SNIPPETS_DIRECTIVES, NgxErrorsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      [ngxerror] {
        color: red;
      }
    `,
  ],
  template: `
    <ngs-code-snippets title="Reactive Form" [snippets]="snippets['form']">
      <ng-container *ngsSnippetResult>
        <form [formGroup]="form">
          <label>
            Name:
            <input formControlName="name" />
          </label>

          <div ngxErrors="name">
            <div ngxError="required">Name is required</div>
          </div>
        </form>
      </ng-container>
    </ngs-code-snippets>
  `,
})
export class ReactiveFormsDemoComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required] }),
  });

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
