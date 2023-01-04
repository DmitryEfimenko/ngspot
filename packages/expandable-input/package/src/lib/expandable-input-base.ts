/* eslint-disable @angular-eslint/directive-class-suffix */
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
} from './expandable-input.animations';

/**
 * Directive that targets an element that will be expanded/collapsed.
 * It can be either the <input /> element itself or its parent.
 */
@Directive({
  selector: '[ngsExpandableInputBase]',
  standalone: true,
})
export abstract class ExpandableInputBase {
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

  @Output() opened = new EventEmitter<void>();

  @Output() closed = new EventEmitter<void>();
}
