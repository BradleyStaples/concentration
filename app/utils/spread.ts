import type {DeckCard} from './types';

export default function spread(deck: DeckCard[]) {
  const shuffledDeck = deck.map((card, index) => {
    const left = 5 * index + 'px';
    const degrees = -15 + index + 'deg';
    card.style = {left, transform: `rotate(${degrees})`};
    return card;
  });
  return shuffledDeck;
}
