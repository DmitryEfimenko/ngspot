import {
  animate,
  animateChild,
  group,
  query,
  sequence,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const ANIMATION_DURATION = 300;
export const ANIMATION_EASING = 'cubic-bezier(.4, 0, .2, 1)';
export const ANIMATION_TIMINGS = '{{ duration }} {{ easing }}';

const iconOpenRotation = [
  query(
    '.icons_icon-open:enter',
    [
      style({ transform: 'rotate(270deg)' }),
      animate(ANIMATION_TIMINGS, style({ transform: 'rotate(0deg)' })),
    ],
    { optional: true }
  ),
  query(
    '.icons_icon-open:leave',
    [
      style({ transform: 'rotate(0deg)' }),
      animate(ANIMATION_TIMINGS, style({ transform: 'rotate(270deg)' })),
    ],
    { optional: true }
  ),
];

const iconCloseRotation = [
  query(
    '.icons_icon-close:enter',
    [
      style({ transform: 'rotate(-270deg)' }),
      animate(ANIMATION_TIMINGS, style({ transform: 'rotate(0deg)' })),
    ],
    { optional: true }
  ),
  query(
    '.icons_icon-close:leave',
    [
      style({ transform: 'rotate(0deg)' }),
      animate(ANIMATION_TIMINGS, style({ transform: 'rotate(-270deg)' })),
    ],
    { optional: true }
  ),
];

const iconsOpacity = [
  query(
    '.icons_icon-close:enter, .icons_icon-open:enter',
    [style({ opacity: 0 }), animate(ANIMATION_TIMINGS, style({ opacity: 1 }))],
    { optional: true }
  ),
  query(
    '.icons_icon-close:leave, .icons_icon-open:leave',
    [
      style({
        opacity: 1,
        position: 'absolute',
      }),
      animate(ANIMATION_TIMINGS, style({ opacity: 0 })),
    ],
    { optional: true }
  ),
];

export const swapIcons = trigger('swapIcons', [
  // Prevent animation on init.
  transition(':enter', []),
  transition('* => *', [
    // group animate enter and leave at the same time
    group([...iconOpenRotation, ...iconCloseRotation, ...iconsOpacity]),
  ]),
]);

export const rotateActionIcon = trigger('rotateActionIcon', [
  transition(':enter', [
    style({ transform: 'rotate(-270deg)', opacity: 0 }),
    animate(
      ANIMATION_TIMINGS,
      style({ transform: 'rotate(0deg)', opacity: 1 })
    ),
  ]),
  transition(':leave', [
    style({ transform: 'rotate(0deg)', opacity: 1 }),
    animate(
      ANIMATION_TIMINGS,
      style({ transform: 'rotate(-270deg)', opacity: 0 })
    ),
  ]),
]);

export const slideInOut = trigger('slideInOut', [
  state('true', style({ width: '100%' })),
  state('false', style({ width: '0px' })),
  transition('true => false', animate(ANIMATION_TIMINGS)),
  transition('false => true', animate(ANIMATION_TIMINGS)),
]);

export const smoothHorizontalCollapse = (params: {
  durationMs: number;
  easing: string;
}) => {
  const timing = `${params.durationMs / 2}ms ${params.easing}`;

  const sizingPropsCollapsed = {
    width: '0',
    minWidth: '0',
    fontSize: '0',
    border: '0',
    padding: '0',
  };

  const sizingPropsExpanded = {
    width: '*',
    minWidth: '*',
    border: '*',
    padding: '*',
  };

  return trigger('smoothHorizontalCollapse', [
    state('true', style({ opacity: 0, ...sizingPropsCollapsed })),
    state('false', style({ opacity: 1, ...sizingPropsExpanded })),
    transition('true => false', [
      sequence([
        style({ fontSize: 0, lineHeight: 0 }),
        animate(timing, style(sizingPropsExpanded)),
        style({ opacity: 0.001, fontSize: '*', lineHeight: '*' }),
        animate(timing, style({ opacity: 1 })),
      ]),
    ]),
    transition('false => true', [
      sequence([
        style({ opacity: 0.999 }),
        animate(timing, style({ opacity: 0, lineHeight: 0 })),
        animate(timing, style(sizingPropsCollapsed)),
      ]),
    ]),
  ]);
};

export const gap = (params: {
  gapAmount: string;
  durationMs: number;
  easing: string;
}) => {
  const duration = params.durationMs / 2;
  const timing = `${duration}ms ${params.easing}`;
  const timingWithDelay = `${duration}ms ${duration}ms ${params.easing}`;

  return trigger('gap', [
    state('true', style({ gap: 0 })),
    state('false', style({ gap: params.gapAmount })),
    transition('true => false', [
      group([
        // this is needed for animations on child elements to keep working
        query('@*', [animateChild()], { optional: true }),
        animate(timing, style({ gap: params.gapAmount })),
      ]),
    ]),
    transition('false => true', [
      group([
        // this is needed for animations on child elements to keep working
        query('@*', [animateChild()], { optional: true }),
        animate(timingWithDelay, style({ gap: 0 })),
      ]),
    ]),
  ]);
};
