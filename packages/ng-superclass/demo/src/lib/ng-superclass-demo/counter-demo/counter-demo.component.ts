import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CODE_SNIPPETS_DIRECTIVES,
  HighlightContentDirective,
  Snippet,
} from '@ngspot/common';
import { CounterComponent } from '@ngspot/ng-superclass';

const consumerTs = require('raw-loader!./snippet-consumer.txt').default;
const snippetTs = require('raw-loader!./snippet-counter.txt').default;

@Component({
  selector: 'ngs-counter-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CODE_SNIPPETS_DIRECTIVES,
    CounterComponent,
    HighlightContentDirective,
  ],
  templateUrl: './counter-demo.component.html',
  styleUrls: ['./counter-demo.component.scss'],
})
export class CounterDemoComponent {
  count = 0;

  snippets: Record<string, Snippet | Snippet[]> = {
    counter: [
      {
        fileName: 'app.component.ts',
        content: consumerTs,
        language: 'typescript',
      },
      {
        fileName: 'counter.component.ts',
        content: snippetTs,
        language: 'typescript',
      },
    ],
  };
}
