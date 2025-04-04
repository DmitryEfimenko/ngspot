export interface Card {
  id: number;
  color: string;
}

let lastCardId = 0;

export function newCard(): Card {
  return { id: ++lastCardId, color: getRandomColor() };
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
