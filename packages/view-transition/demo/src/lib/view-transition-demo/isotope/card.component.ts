import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { VIEW_TRANSITION_DECLARATIONS } from '@ngspot/view-transition';

import { IsotopeEl } from './model';

@Component({
  selector: 'ngs-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...VIEW_TRANSITION_DECLARATIONS],
  host: {
    '[style.--pos]': 'element().index',
  },
  styles: `
    :host {
      --hue: calc(var(--pos) * 20);
      background: oklch(65% 0.3 var(--hue));
      color: oklch(10% 0.3 var(--hue));

      container-type: inline-size;
      display: grid;
      align-content: space-between;
      aspect-ratio: 1;
      padding: 1rem;
      font-size: 1.25rem;
    }

    .number {
      text-align: end;
    }

    .symbol {
      color: Canvas;
      font-size: 60cqi;
      font-weight: bolder;
    }

    .float {
      font-size: 0.75em;
    }
  `,
  template: `
    <div class="number">{{ element().number }}</div>
    <div class="symbol">{{ element().abbr }}</div>
    <div class="name">{{ element().name }}</div>
    <div class="float">{{ element().float }}</div>

    <vt-style [vtStyle]="vtStyle()" />
  `,
})
export class CardComponent {
  element = input.required<IsotopeEl>();

  vtStyle = computed(() => {
    const ix = this.element().index;
    const delay = ix * 20;
    const vtName = `card-${ix}`;

    return `
      ::view-transition-group(${vtName}) {
        animation-delay: ${delay}ms;
      }
    `;
  });
}
