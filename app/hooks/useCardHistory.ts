import {type SetStateAction, useState} from 'react';
import type {CardHistory} from '../utils/types';
import {ANIMATION_DURATION} from '../utils/constants';

interface Props {
  isGameActive: boolean;
  numberOfCards: number;
  setIsDisabled: (value: SetStateAction<boolean>) => void;
}

export default function useCardHistory({
  isGameActive,
  numberOfCards,
  setIsDisabled,
}: Props) {
  const [cardHistory, setCardHistory] = useState<CardHistory[]>([]);
  const [numMatches, setNumMatches] = useState(0);

  const updateCardHistory = (newHistory: CardHistory) => {
    if (!isGameActive) return;
    if (cardHistory.length < 2) {
      setCardHistory((history) => history.concat(newHistory));
    }
  };

  const checkForMatch = () => {
    if (cardHistory.length !== 2) return false;
    const [firstCard, secondCard] = cardHistory;
    const isMatch =
      firstCard.suit === secondCard.suit && firstCard.face === secondCard.face;
    if (isMatch) {
      setNumMatches((numMatches) => numMatches + 1);
    } else {
      setIsDisabled(true);
      setTimeout(() => {
        firstCard.setIsFaceup(false);
        secondCard.setIsFaceup(false);
        setIsDisabled(false);
      }, ANIMATION_DURATION);
    }
    setCardHistory([]);

    return isMatch;
  };

  const allMatchesFound = isGameActive && numMatches === numberOfCards / 2;

  return {
    cardHistory,
    numMatches,
    allMatchesFound,
    updateCardHistory,
    checkForMatch,
  };
}
