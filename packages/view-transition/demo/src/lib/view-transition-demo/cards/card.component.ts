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
      max-width: 10vw;
      min-width: 50px;

      /* background-color: grey; */
    }

    .delete-btn {
      --icon: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0aXRsZS8+PHBhdGggZD0iTTExMiwxMTJsMjAsMzIwYy45NSwxOC40OSwxNC40LDMyLDMyLDMySDM0OGMxNy42NywwLDMwLjg3LTEzLjUxLDMyLTMybDIwLTMyMCIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjMycHgiLz48bGluZSBzdHlsZT0ic3Ryb2tlOiMwMDA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjMycHgiIHgxPSI4MCIgeDI9IjQzMiIgeTE9IjExMiIgeTI9IjExMiIvPjxwYXRoIGQ9Ik0xOTIsMTEyVjcyaDBhMjMuOTMsMjMuOTMsMCwwLDEsMjQtMjRoODBhMjMuOTMsMjMuOTMsMCwwLDEsMjQsMjRoMHY0MCIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjMycHgiLz48bGluZSBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojMDAwO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MzJweCIgeDE9IjI1NiIgeDI9IjI1NiIgeTE9IjE3NiIgeTI9IjQwMCIvPjxsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMwMDA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDozMnB4IiB4MT0iMTg0IiB4Mj0iMTkyIiB5MT0iMTc2IiB5Mj0iNDAwIi8+PGxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzAwMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjMycHgiIHgxPSIzMjgiIHgyPSIzMjAiIHkxPSIxNzYiIHkyPSI0MDAiLz48L3N2Zz4=);
      position: absolute;
      bottom: -0.75rem;
      right: -0.75rem;
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
    <button class="delete-btn" type="button" (click)="deleteCard.emit(card())">
      <span class="sr-only">Delete</span>
    </button>
  `,
})
export class CardComponent {
  card = input.required<Card>();

  deleteCard = output<Card>();
}
