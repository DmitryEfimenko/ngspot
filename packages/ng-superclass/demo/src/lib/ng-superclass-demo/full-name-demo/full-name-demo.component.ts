import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CODE_SNIPPETS_DIRECTIVES,
  HighlightContentDirective,
  Snippet,
} from '@ngspot/common';
import { FullNameReactiveComponent } from '@ngspot/ng-superclass';

const consumerTs = require('raw-loader!./snippet-consumer.txt').default;
const fullNameTs = require('raw-loader!./snippet-full-name.txt').default;

@Component({
  selector: 'ngs-full-name-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CODE_SNIPPETS_DIRECTIVES,
    FullNameReactiveComponent,
    HighlightContentDirective,
  ],
  templateUrl: './full-name-demo.component.html',
  styleUrls: ['./full-name-demo.component.scss'],
})
export class FullNameDemoComponent {
  name: string;

  snippets: Record<string, Snippet | Snippet[]> = {
    fullName: [
      {
        fileName: 'app.component.ts',
        content: consumerTs,
        language: 'typescript',
      },
      {
        fileName: 'full-name.component.ts',
        content: fullNameTs,
        language: 'typescript',
      },
    ],
  };
}
