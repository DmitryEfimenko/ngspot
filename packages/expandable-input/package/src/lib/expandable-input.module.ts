import { ExpIconActionDirective } from './exp-icon-action.directive';
import { ExpIconCloseDirective } from './exp-icon-close.directive';
import { ExpIconOpenDirective } from './exp-icon-open.directive';
import { ExpInputDirective } from './exp-input.directive';
import { ExpandableInputComponent } from './expandable-input.component';
import { FocusableDirective } from './focusable.directive';

export const EXPANDABLE_INPUT_DIRECTIVES = [
  ExpandableInputComponent,
  ExpInputDirective,
  ExpIconOpenDirective,
  ExpIconCloseDirective,
  ExpIconActionDirective,
  FocusableDirective,
] as const;
