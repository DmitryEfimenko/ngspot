/* eslint-disable @angular-eslint/directive-selector */
import { Directive, OnDestroy } from '@angular/core';
import { MatListItem } from '@angular/material/list';
import { RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[mat-list-item][routerLinkActive]',
  standalone: true,
})
export class RouterActivatedMatListItemDirective implements OnDestroy {
  private subs = new Subscription();

  constructor(matListItem: MatListItem, routerLinkActive: RouterLinkActive) {
    this.subs.add(
      routerLinkActive.isActiveChange.subscribe((isActive) => {
        matListItem.activated = isActive;
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
