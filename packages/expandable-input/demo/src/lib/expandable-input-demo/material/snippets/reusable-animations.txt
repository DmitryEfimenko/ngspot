import {
  animate,
  AnimationMetadata,
  group,
  query,
  sequence,
  style,
} from '@angular/animations';
import {
  ANIMATION_TIMINGS,
  IconAnimationMetadata,
} from '@ngspot/expandable-input';

// this animation is almost the same as original. Except that `transition: rotate`
// animation is removed from the animation applied to the 'root' element and
// applied to the child `mat-icon` element instead.
const iconOpenEnter: AnimationMetadata[] = [
  group([
    sequence([
      style({ opacity: 0, position: 'absolute', zIndex: 3 }),
      animate(ANIMATION_TIMINGS, style({ opacity: 1 })),
    ]),
    query('mat-icon', [
      style({ transform: 'rotate(270deg)' }),
      animate(ANIMATION_TIMINGS, style({ transform: 'rotate(0deg)' })),
    ]),
  ]),
];

const iconOpenLeave: AnimationMetadata[] = [
  group([
    sequence([
      style({ opacity: 1 }),
      animate(ANIMATION_TIMINGS, style({ opacity: 0 })),
    ]),
    query('mat-icon', [
      style({ transform: 'rotate(0deg)' }),
      animate(ANIMATION_TIMINGS, style({ transform: 'rotate(270deg)' })),
    ]),
  ]),
];

const iconCloseEnter: AnimationMetadata[] = [
  group([
    sequence([
      style({ opacity: 0, position: 'absolute', zIndex: 3 }),
      animate(ANIMATION_TIMINGS, style({ opacity: 1 })),
    ]),
    query('mat-icon', [
      style({ transform: 'rotate(-270deg)' }),
      animate(ANIMATION_TIMINGS, style({ transform: 'rotate(0deg)' })),
    ]),
  ]),
];

const iconCloseLeave: AnimationMetadata[] = [
  group([
    sequence([
      style({ opacity: 1 }),
      animate(ANIMATION_TIMINGS, style({ opacity: 0 })),
    ]),
    query('mat-icon', [
      style({ transform: 'rotate(0deg)' }),
      animate(ANIMATION_TIMINGS, style({ transform: 'rotate(-270deg)' })),
    ]),
  ]),
];

export const iconOpenAnimation: IconAnimationMetadata = {
  enter: iconOpenEnter,
  leave: iconOpenLeave,
};

export const iconCloseAnimation: IconAnimationMetadata = {
  enter: iconCloseEnter,
  leave: iconCloseLeave,
};
