import { ClassForActiveViewTransition } from './lib/class-for-active.directive';
import { ClassForPassiveViewTransition } from './lib/class-for-passive.directive';
import { VtStyleComponent } from './lib/style.component';
import { ViewTransitionForActive } from './lib/view-transition-name-for-active.directive';
import {
  ViewTransitionNameForPassiveExplicit,
  ViewTransitionNameForPassiveShorthand,
} from './lib/view-transition-name-for-passive.directive';
import { ViewTransitionNameForRouterLink } from './lib/view-transition-name-for-router-link.directive';
import { ViewTransitionNameForRouting } from './lib/view-transition-name-for-routing.directive';
import { ViewTransitionRenderer } from './lib/view-transition.directive';

const VIEW_TRANSITION_DIRECTIVES = [
  ViewTransitionRenderer,
  ViewTransitionForActive,
  ViewTransitionNameForPassiveExplicit,
  ViewTransitionNameForPassiveShorthand,
  ClassForActiveViewTransition,
  ClassForPassiveViewTransition,
  ViewTransitionNameForRouting,
  ViewTransitionNameForRouterLink,
  VtStyleComponent,
] as const;

export { VIEW_TRANSITION_DIRECTIVES };

export * from './lib/class-for-active.directive';
export * from './lib/class-for-passive.directive';
export * from './lib/view-transition-name-for-active.directive';
export * from './lib/view-transition-name-for-passive.directive';
export * from './lib/view-transition-name-for-routing.directive';
export * from './lib/view-transition-name-for-router-link.directive';
export * from './lib/view-transition.directive';
export * from './lib/view-transition.service';
export * from './lib/style.component';
