import {type MouseEvent, useLayoutEffect, useState} from 'react';
import classnames from 'classnames';
import type {BaseCard, CardHistory} from '../utils/types';
import {ANIMATION_DURATION} from '../utils/constants';

interface Props extends BaseCard {
  isPlaying: boolean;
  disabled: boolean;
  clickIncrementor?: () => void;
  updateCardHistory?: ({suit, face, setIsFaceup}: CardHistory) => void;
}

export default function Card({
  face,
  suit,
  color,
  isPlaying,
  style,
  disabled,
  clickIncrementor,
  updateCardHistory,
}: Props) {
  const [isFaceup, setIsFaceup] = useState(false);
  const [showCardInfo, setShowCardInfo] = useState(false);

  useLayoutEffect(() => {
    if (isPlaying && !isFaceup && showCardInfo) {
      setTimeout(() => {
        setShowCardInfo(false);
      }, ANIMATION_DURATION);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFaceup]);

  if (isPlaying && isFaceup && !showCardInfo) {
    setShowCardInfo(true);
  }

  const flipCard = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isPlaying || isFaceup) {
      event.preventDefault();
      return false;
    }
    setIsFaceup(true);
    clickIncrementor?.();
    updateCardHistory?.({suit, face, setIsFaceup});
  };

  const cardClasses = classnames({
    card: true,
    facedown: !isFaceup,
    faceup: isFaceup,
    black: showCardInfo && color === 'Black',
    red: showCardInfo && color === 'Red',
  });

  return (
    <button
      className='cardButton'
      onClick={flipCard}
      disabled={disabled}
      style={style}
    >
      <div className={cardClasses}>
        <div className='cardback'></div>
        <div className='cardfront'>
          <span className='face'>{showCardInfo && <span>{face}</span>}</span>
          <span className='suit'>{showCardInfo && <span>{suit}</span>}</span>
        </div>
      </div>
    </button>
  );
}
