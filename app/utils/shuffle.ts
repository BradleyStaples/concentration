import type {BaseCard} from './types';

import {FACE, SUIT, COLOR} from './types';
import type {Face, Suit, Color} from './types';

export default function shuffle() {
  const cardList: string[] = [];

  Object.values(FACE).forEach((face) => {
    Object.values(SUIT).forEach((suit) => {
      cardList.push(`${face}${suit}`);
    });
  });

  const doubleDeck = [...cardList, ...cardList];
  const shuffledDeck: BaseCard[] = [];

  while (doubleDeck.length > 0) {
    const index = Math.floor(Math.random() * doubleDeck.length);
    const card = doubleDeck.splice(index - 1, 1)[0];
    const face = card.substring(0, 1) as Face;
    const suit = card.substring(1) as Suit;
    const color = COLOR[suit] as Color;
    shuffledDeck.push({face, suit, color});
  }

  return shuffledDeck;
}
