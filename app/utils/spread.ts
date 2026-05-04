import type {BaseCard} from './types';

export default function spread(deck: BaseCard[]) {
  const shuffledDeck = deck.map((card, index) => {
    const left = 7 * index + 'px';
    const degrees = -30 + index * 2 + 'deg';
    card.style = {left, transform: `rotate(${degrees})`};
    return card;
  });
  return shuffledDeck;
}
