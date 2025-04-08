import { ClassForActiveViewTransition } from './class-for-active.directive';
import { ClassForPassiveViewTransition } from './class-for-passive.directive';
import { VtStyleComponent } from './style.component';
import { ViewTransitionActiveGroupId } from './view-transition-active-group-id.directive';
import { ViewTransitionForActive } from './view-transition-name-for-active.directive';
import {
  ViewTransitionNameForPassiveExplicit,
  ViewTransitionNameForPassiveShorthand,
} from './view-transition-name-for-passive.directive';
import { ViewTransitionNameForRouterLink } from './view-transition-name-for-router-link.directive';
import { ViewTransitionNameForRouting } from './view-transition-name-for-routing.directive';
import { ViewTransitionRenderer } from './view-transition.directive';

export const VIEW_TRANSITION_DECLARATIONS = [
  ViewTransitionRenderer,
  ViewTransitionForActive,
  ViewTransitionNameForPassiveExplicit,
  ViewTransitionNameForPassiveShorthand,
  ClassForActiveViewTransition,
  ClassForPassiveViewTransition,
  ViewTransitionNameForRouting,
  ViewTransitionNameForRouterLink,
  VtStyleComponent,
  ViewTransitionActiveGroupId,
] as const;
