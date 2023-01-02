import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  OnDestroy,
  QueryList,
  ViewChild,
} from '@angular/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, startWith, Subscription, tap } from 'rxjs';
import { NavigationFocusService } from '../navigation-focus';
import { filterOutNullish } from '../rxjs';
import { RoutedTabDirective } from './routed-tab.directive';

export const ROUTE_PARAM_NAME = 'section';
export const ROUTED_TABS_PATH = `:${ROUTE_PARAM_NAME}`;

/**
 * Renders tabs on the page for each corresponding `*ngsRoutedTab` provided.
 * The parent component of this component must be routed and use
 * `{ path: ROUTED_TABS_PATH, component: ... }`
 * For each navigated route, if there was a corresponding `*ngsRoutedTab`, that tab
 * would automatically get selected.
 */
@Component({
  selector: 'ngs-routed-tabs',
  templateUrl: './routed-tabs.component.html',
  styleUrls: ['./routed-tabs.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutedTabsComponent implements AfterViewInit, OnDestroy {
  private subs = new Subscription();

  @ContentChildren(RoutedTabDirective)
  routedTabs: QueryList<RoutedTabDirective>;

  isFirstSync = true;

  @ViewChild(MatTabGroup, { static: true }) tabs: MatTabGroup;

  constructor(
    private navigationFocusService: NavigationFocusService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    this.syncRouteWithTabs();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  updateUrl(tabIndex: number) {
    const desiredRouteName = this.routedTabs.get(tabIndex)?.routeName;
    const currentRouteName =
      this.activatedRoute.snapshot.paramMap.get(ROUTE_PARAM_NAME);

    if (desiredRouteName && desiredRouteName !== currentRouteName) {
      const url = this.router
        .createUrlTree([desiredRouteName], {
          relativeTo: this.activatedRoute.parent,
        })
        .toString();
      this.router.navigateByUrl(url);
    }
  }

  /**
   * When route changes, select the corresponding tab as active.
   */
  private syncRouteWithTabs() {
    const syncRouteWithTabs$ =
      this.navigationFocusService.navigationEndEvents.pipe(
        startWith(null),
        map(() => this.activatedRoute.snapshot.paramMap.get(ROUTE_PARAM_NAME)),
        filterOutNullish(),
        tap((id) => {
          let ix = -1;
          for (let i = 0; i < this.routedTabs.length; i++) {
            const routedTab = this.routedTabs.get(i);
            if (routedTab?.routeName === id) {
              ix = i;
              break;
            }
          }
          if (ix > -1) {
            this.tabs.selectedIndex = ix;
            setTimeout(() => {
              this.isFirstSync = false;
            }, 500);
          }
        })
      );

    this.subs.add(syncRouteWithTabs$.subscribe());
  }
}
