import {FACE, SUIT, COLOR} from './types';
import type {BaseCard, Face, Suit, Color} from './types';
import {CARDS} from './constants';

export function shuffle() {
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

export function spread(deck: BaseCard[]) {
  // magic numbers ahead
  const spreadDeck = deck.map((card, index) => {
    const left = 10 * index + 'px';
    const degrees = -30 + index * 3 + 'deg';
    card.style = {top: '0px', left, transform: `rotate(${degrees})`};
    return card;
  });
  return spreadDeck;
}

export function stack(deck: BaseCard[]) {
  const stackedDeck = deck.map((card) => {
    card.style = {left: '0px', top: '0px', transform: 'unset'};
    return card;
  });
  return stackedDeck;
}

export function deal(deck: BaseCard[]) {
  const dealtDeck = deck.map((card, index) => {
    const cardNumber = index + 1;
    const colNumber =
      cardNumber % CARDS.PER_ROW === 0
        ? CARDS.PER_ROW
        : cardNumber % CARDS.PER_ROW;
    const rowNumber = Math.ceil(cardNumber / CARDS.PER_ROW);
    const left = CARDS.GAP + (CARDS.WIDTH + CARDS.GAP) * (colNumber - 1) + 'px';
    const top = CARDS.GAP + (CARDS.HEIGHT + CARDS.GAP) * (rowNumber - 1) + 'px';
    card.style = {left, top, transform: 'unset'};
    return card;
  });
  return dealtDeck;
}
