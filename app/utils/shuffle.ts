import type {DeckCard} from './types';

const FACES = ['A', 'K', 'Q', 'J'] as const;
const SUITS = ['♥', '♦', '♣', '♠'] as const;
const COLORS = {'♥': 'red', '♦': 'red', '♣': 'black', '♠': 'black'} as const;

export default function shuffle() {
  const cardList: string[] = [];
  FACES.forEach((face) => {
    SUITS.forEach((suit) => {
      cardList.push(`${face}${suit}`);
    });
  });

  const doubleDeck = [...cardList, ...cardList];
  const shuffledDeck: DeckCard[] = [];

  while (doubleDeck.length > 0) {
    const index = Math.floor(Math.random() * doubleDeck.length);
    const card = doubleDeck.splice(index - 1, 1)[0];
    const suit = card.substring(1, 1);

    shuffledDeck.push({
      face: card.substring(0, 1),
      suit,
      color: COLORS[suit as keyof typeof COLORS],
    });
  }

  return shuffledDeck;
}
