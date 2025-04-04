import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  VIEW_TRANSITION_DIRECTIVES,
  ViewTransitionService,
} from '@ngspot/view-transition';

import { CardComponent } from './card.component';
import { Card, newCard } from './model';

@Component({
  selector: 'ngs-vt-ordering-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [...VIEW_TRANSITION_DIRECTIVES, CardComponent],
  styleUrls: [
    './ordering-demo.component-base-styles.scss',
    './ordering-demo.component-animations.scss',
  ],
  templateUrl: './ordering-demo.component.html',
})
export class ViewTransitionOrderingDemoComponent {
  private viewTransitionService = inject(ViewTransitionService);

  cards = signal<Card[]>([newCard(), newCard(), newCard()]);

  moveUp(card: Card) {
    this.viewTransitionService.setActiveViewTransitionNames(`card-${card.id}`);
    this.cards.update(move(card.id, 'up'));
  }

  moveDown(card: Card) {
    this.viewTransitionService.setActiveViewTransitionNames(`card-${card.id}`);
    this.cards.update(move(card.id, 'down'));
  }
}

function move(cardId: Card['id'], direction: 'up' | 'down') {
  return (cards: Card[]) => {
    const index = cards.findIndex((c) => c.id === cardId);
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (index >= 0 && newIndex >= 0 && newIndex < cards.length) {
      const newCards = [...cards];
      [newCards[index], newCards[newIndex]] = [
        newCards[newIndex],
        newCards[index],
      ];
      return newCards;
    }

    return cards;
  };
}
