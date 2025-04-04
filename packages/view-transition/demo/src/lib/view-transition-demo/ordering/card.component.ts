import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { Card } from './model';

@Component({
  selector: 'ngs-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.backgroundColor]': 'card().color',
  },
  styles: `
    :host {
      width: 100%;
      aspect-ratio: 2/3;
      display: block;
      position: relative;
      border-radius: 1rem;
      max-height: 10vw;
      min-height: 50px;
      max-width: 30vw;
    }

    .move-btn {
      --icon: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAfwAAAH8BuLbMiQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAB3SURBVDiN1dMhDoAwDEbhV06yC1Rzf7MEhcFxgyluUEwFAdqREARLfrfvZWZiZrw5wyv9aUBEVEQWn4YFM7sMUKAB5muA3t59gNPIUxxGenjzhZEeHn1hJMWH14URgDnDncgMUHs4iVSAAkzAmuFTZHVT5P+faQca8uSjDbmP3wAAAABJRU5ErkJggg==);
      position: absolute;
      right: -0.2rem;
      width: 3rem;
      height: 3rem;
      padding: 0.5rem;
      border: 4px solid;
      border-radius: 100%;
      background: aliceblue var(--icon) no-repeat 50% 50% / 70%;
      color: white;
      cursor: pointer;

      &:hover {
        background-color: orangered;
      }

      &.up-btn {
        top: -0.2rem;
      }

      &.down-btn {
        transform: rotate(180deg);
        bottom: -0.2rem;
      }
    }

    .sr-only {
      border: 0;
      clip: rect(1px, 1px, 1px, 1px);
      clip-path: inset(50%);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
      white-space: nowrap;
    }
  `,
  template: `
    <button class="move-btn up-btn" type="button" (click)="up.emit(card())">
      <span class="sr-only">Up</span>
    </button>

    <button class="move-btn down-btn" type="button" (click)="down.emit(card())">
      <span class="sr-only">Down</span>
    </button>
  `,
})
export class CardComponent {
  card = input.required<Card>();

  up = output<Card>();
  down = output<Card>();
}
