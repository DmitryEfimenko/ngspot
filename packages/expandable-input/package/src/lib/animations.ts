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
    state(
      'true',
      style({ opacity: 0, display: 'none', ...sizingPropsCollapsed }),
    ),
    state('false', style({ opacity: 1, ...sizingPropsExpanded })),
    transition('true => false', [
      style({ display: '*' }),
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

export const animateCssProperty = (params: {
  propName: string;
  falseValue: string;
  trueValue: string;
  durationMs: number;
  easing: string;
}) => {
  const duration = params.durationMs / 2;
  const timing = `${duration}ms ${params.easing}`;
  const timingWithDelay = `${duration}ms ${duration}ms ${params.easing}`;

  return trigger(params.propName, [
    state('true', style({ [params.propName]: params.trueValue })),
    state('false', style({ [params.propName]: params.falseValue })),
    transition('true => false', [
      group([
        // this is needed for animations on child elements to keep working
        query('@*', [animateChild()], { optional: true }),
        animate(timing, style({ [params.propName]: params.falseValue })),
      ]),
    ]),
    transition('false => true', [
      group([
        // this is needed for animations on child elements to keep working
        query('@*', [animateChild()], { optional: true }),
        animate(
          timingWithDelay,
          style({ [params.propName]: params.trueValue }),
        ),
      ]),
    ]),
  ]);
};
