import {
  animate,
  AnimationMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { IconAnimationMetadata } from './model';

export const ANIMATION_DURATION = 300;
export const ANIMATION_EASING = 'cubic-bezier(.4, 0, .2, 1)';
export const ANIMATION_TIMINGS = '{{ duration }} {{ easing }}';

const iconOpenEnter: AnimationMetadata[] = [
  style({
    transform: 'rotate(270deg)',
    opacity: 0,
    position: 'absolute',
    zIndex: 3,
  }),
  animate(ANIMATION_TIMINGS, style({ transform: 'rotate(0deg)', opacity: 1 })),
];

const iconOpenLeave: AnimationMetadata[] = [
  style({ transform: 'rotate(0deg)', opacity: 1 }),
  animate(
    ANIMATION_TIMINGS,
    style({ transform: 'rotate(270deg)', opacity: 0 })
  ),
];

const iconCloseEnter: AnimationMetadata[] = [
  style({
    transform: 'rotate(-270deg)',
    opacity: 0,
    position: 'absolute',
    zIndex: 3,
  }),
  animate(ANIMATION_TIMINGS, style({ transform: 'rotate(0deg)', opacity: 1 })),
];

const iconCloseLeave: AnimationMetadata[] = [
  style({ transform: 'rotate(0deg)', opacity: 1 }),
  animate(
    ANIMATION_TIMINGS,
    style({ transform: 'rotate(-270deg)', opacity: 0 })
  ),
];

export const iconOpenAnimation: IconAnimationMetadata = {
  enter: iconOpenEnter,
  leave: iconOpenLeave,
};

export const iconCloseAnimation: IconAnimationMetadata = {
  enter: iconCloseEnter,
  leave: iconCloseLeave,
};

/**
 * Animation applied to the input wrapper
 */
export const slideInOut = trigger('slideInOut', [
  state('true', style({ width: '100%' })),
  state('false', style({ width: '0px', opacity: 0 })),
  transition('true => false', animate(ANIMATION_TIMINGS)),
  transition('false => true', animate(ANIMATION_TIMINGS)),
]);
