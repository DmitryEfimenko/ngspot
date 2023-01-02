import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HighlightModule } from 'ngx-highlightjs';
import { SnippetDescriptionDirective } from './snippet-description.directive';

import { SnippetResultDirective } from './snippet-result.directive';

@Component({
  selector: 'ngs-code-snippets',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    HighlightModule,
    MatSnackBarModule,
  ],
  templateUrl: './code-snippets.component.html',
  styleUrls: ['./code-snippets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeSnippetsComponent {
  private document = inject(DOCUMENT);
  private snackBar = inject(MatSnackBar);

  _snippets: Snippet[];

  @Input() title: string;

  @Input()
  set snippets(val: Snippet | Snippet[]) {
    this._snippets = Array.isArray(val)
      ? val
      : [val ?? { fileName: 'N/A', content: 'NONE PROVIDED' }];
  }

  @Input()
  get expanded() {
    return this._expanded;
  }
  set expanded(val: boolean | 'true' | 'false') {
    this._expanded = coerceBooleanProperty(val);
  }
  private _expanded = true;

  @ContentChild(SnippetDescriptionDirective, { static: true })
  snippetDescription: SnippetDescriptionDirective;

  @ContentChild(SnippetResultDirective, { static: true })
  snippetResult: SnippetResultDirective;

  @ViewChild(MatCardTitle, { static: true, read: ElementRef })
  titleContainerRef: ElementRef<HTMLElement>;

  copyLinkToExample() {
    const fragment =
      this.titleContainerRef.nativeElement.querySelector('h3')?.id;
    if (fragment) {
      const { origin, pathname } = this.document.location;
      const url = `${origin}${pathname}#${fragment}`;
      navigator.clipboard.writeText(url).then(() => {
        this.snackBar.open('Copied');
      });
    }
  }
}

export interface Snippet {
  fileName: string;
  content: string;
}
