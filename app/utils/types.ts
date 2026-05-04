import type {CSSProperties, Dispatch, SetStateAction} from 'react';

export const FACE = {Ace: 'A', King: 'K', Queen: 'Q', Jack: 'J'} as const;
export type Face = (typeof FACE)[keyof typeof FACE];

export const SUIT = {
  Hearts: '♥',
  Diamonds: '♦',
  Clubs: '♣',
  Spades: '♠',
} as const;
export type Suit = (typeof SUIT)[keyof typeof SUIT];

export const COLOR = {
  '♥': 'Red',
  '♦': 'Red',
  '♣': 'Black',
  '♠': 'Black',
} as const;
export type Color = (typeof COLOR)[keyof typeof COLOR];

export interface BaseCard {
  face: Face;
  suit: Suit;
  color: Color;
  style?: CSSProperties | undefined;
}

export interface CardHistory {
  suit: Suit;
  face: Face;
  setIsFaceup: Dispatch<SetStateAction<boolean>>;
}
