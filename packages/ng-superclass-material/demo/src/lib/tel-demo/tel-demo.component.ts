import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import {
  CODE_SNIPPETS_DIRECTIVES,
  Snippet,
} from '@ngspot/common/code-snippets';
import { HighlightContentDirective } from '@ngspot/common/highlight-content';
import { MyTelInputComponent, MyTel } from '@ngspot/ng-superclass-material';

const consumerTs = require('raw-loader!./snippet-consumer.txt').default;
const snippetTs = require('raw-loader!./snippet-tel.txt').default;

@Component({
  selector: 'ngs-tel-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    CODE_SNIPPETS_DIRECTIVES,
    MyTelInputComponent,
    HighlightContentDirective,
  ],
  templateUrl: './tel-demo.component.html',
  styleUrls: ['./tel-demo.component.scss'],
})
export class TelDemoComponent {
  tel = new MyTel('', '', '');

  snippets: Record<string, Snippet | Snippet[]> = {
    tel: [
      {
        fileName: 'app.component.ts',
        content: consumerTs,
        language: 'typescript',
      },
      {
        fileName: 'tel.component.ts',
        content: snippetTs,
        language: 'typescript',
      },
    ],
  };
}
