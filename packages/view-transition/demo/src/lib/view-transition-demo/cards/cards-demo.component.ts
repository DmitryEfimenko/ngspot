import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  VIEW_TRANSITION_DECLARATIONS,
  ViewTransitionService,
} from '@ngspot/view-transition';

import { CardComponent } from './card.component';
import { Card, newCard } from './model';

@Component({
  selector: 'ngs-vt-cards-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [...VIEW_TRANSITION_DECLARATIONS, CardComponent],
  styleUrls: [
    './cards-demo.component-base-styles.scss',
    './cards-demo.component-animations.scss',
  ],
  templateUrl: './cards-demo.component.html',
})
export class ViewTransitionCardsDemoComponent {
  private viewTransitionService = inject(ViewTransitionService);

  cards = signal<Card[]>([newCard(), newCard(), newCard()]);

  addCard() {
    const card = newCard();
    this.viewTransitionService.setActiveViewTransitionNames(`card-${card.id}`);
    this.cards.update((cards) => [...cards, card]);
  }

  deleteCard(card: Card) {
    this.viewTransitionService.setActiveViewTransitionNames(`card-${card.id}`);
    this.cards.update((cards) => cards.filter((c) => c.id !== card.id));
  }
}
