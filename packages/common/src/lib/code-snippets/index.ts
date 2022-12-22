import { CodeSnippetsComponent } from './code-snippets.component';
import { SnippetDescriptionDirective } from './snippet-description.directive';
import { SnippetResultDirective } from './snippet-result.directive';

const CODE_SNIPPETS_DIRECTIVES = [
  CodeSnippetsComponent,
  SnippetDescriptionDirective,
  SnippetResultDirective,
] as const;

export * from './code-snippets.component';
export * from './snippet-description.directive';
export * from './snippet-result.directive';
export { CODE_SNIPPETS_DIRECTIVES };
