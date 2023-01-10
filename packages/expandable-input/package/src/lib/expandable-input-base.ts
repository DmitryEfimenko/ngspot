/* eslint-disable @angular-eslint/directive-class-suffix */
import {
  AfterContentInit,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ExpIconActionDirective } from './exp-icon-action.directive';
import { ExpIconCloseDirective } from './exp-icon-close.directive';
import { ExpIconOpenDirective } from './exp-icon-open.directive';
import { ExpInputDirective } from './exp-input.directive';
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  iconCloseAnimation,
  iconOpenAnimation,
} from './expandable-input.animations';

export class ExpInputError extends Error {
  constructor(message: string) {
    super(`Error in ngs-expandable-input: ${message}`);
  }
}

/**
 * Directive that targets an element that will be expanded/collapsed.
 * It can be either the <input /> element itself or its parent.
 */
@Directive({
  selector: '[ngsExpandableInputBase]',
  standalone: true,
})
export abstract class ExpandableInputBase implements AfterContentInit {
  /**
   * If multiple components use the same value for "group" input, only one
   * component with that group value can be expanded at a time
   */
  @Input() group: string | undefined;

  /**
   * When true, input looses focus if Esc is pressed
   */
  @Input() blurInputOnEsc = true;

  /**
   * When set to KeyboardEvent.key, input will expand when that key is pressed
   */
  @Input() openOnKey: string | undefined;

  /**
   * How long it takes for input to expand
   */
  @Input() animationDuration = `${ANIMATION_DURATION}ms`;

  /**
   * The easing function for input expansion animation
   */
  @Input() animationEasing = ANIMATION_EASING;

  /**
   * A set of enter and leave AnimationMetadata applied to icon "open".
   * See example of usage: https://dmitryefimenko.github.io/ngspot/expandable-input/material#as_a_reusable_component
   */
  @Input() iconOpenAnimation = iconOpenAnimation;

  /**
   * A set of enter and leave AnimationMetadata applied to icon "close".
   * See example of usage: https://dmitryefimenko.github.io/ngspot/expandable-input/material#as_a_reusable_component
   */
  @Input() iconCloseAnimation = iconCloseAnimation;

  /**
   * A set of enter and leave AnimationMetadata applied to icon "action".
   * See example of usage: https://dmitryefimenko.github.io/ngspot/expandable-input/material#as_a_reusable_component
   */
  @Input() iconActionAnimation = iconCloseAnimation;

  /**
   * Event emitted when input shows
   */
  @Output() opened = new EventEmitter<void>();

  /**
   * Event emitted when input hides
   */
  @Output() closed = new EventEmitter<void>();

  // marked as static: false for the same of extensibility story
  // where templateRefs are placed behind *ngIf directives
  @ContentChild(ExpInputDirective, { static: false })
  protected expInputDirective: ExpInputDirective;

  @ContentChild(ExpIconOpenDirective, { static: false })
  protected iconOpenDirective: ExpIconOpenDirective;

  @ContentChild(ExpIconCloseDirective, { static: false })
  protected iconCloseDirective: ExpIconCloseDirective;

  @ContentChild(ExpIconActionDirective, { static: false })
  protected expIconActionDirective: ExpIconActionDirective;

  ngAfterContentInit() {
    this.sanityCheck();
  }

  private sanityCheck() {
    if (!this.expInputDirective) {
      throw new ExpInputError(
        'You need to include an element with *ngsExpInput structural directive'
      );
    }

    if (!this.iconOpenDirective) {
      throw new ExpInputError(
        'You need to include an element with *ngsExpIconOpen structural directive'
      );
    }

    if (!this.iconCloseDirective) {
      throw new ExpInputError(
        'You need to include an element with *ngsExpIconClose structural directive'
      );
    }
  }
}
