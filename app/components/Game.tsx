'use client';
import {useState} from 'react';
import classnames from 'classnames';

import Card from './Card';
import Scoring from './Scoring';
import useInterval from '../hooks/useInterval';
import useCardHistory from '../hooks/useCardHistory';
import type {BaseCard} from '../utils/types';
import {
  ANIMATION_DURATION,
  ONE_SECOND,
  LABELS,
  STATUSES,
  CARDS,
} from '../utils/constants';
import {shuffle, spread, stack, deal} from '../utils/card_actions';

// TODOs:
// - responsive layout for smaller viewports
// - left-align button at game start, then center after

export default function Game() {
  const getPrecision = (value: number, precision: number = 2) => {
    return parseFloat(value.toFixed(precision));
  };
  const [buttonLabel, setButtonLabel] = useState(LABELS.START);
  const [showOverlay, setShowOverlay] = useState(false);
  const [numClicks, setNumClicks] = useState(0);
  const [numSeconds, setNumSeconds] = useState(0);
  const [endStats, setEndStats] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<BaseCard[]>([]);
  const [gameStatus, setGameStatus] = useState(STATUSES.INITIAL);

  const isGameStarted = gameStatus > STATUSES.INITIAL;
  const isGameActive = gameStatus === STATUSES.PLAYING;

  const {
    cardHistory,
    numMatches,
    allMatchesFound,
    updateCardHistory,
    checkForMatch,
  } = useCardHistory({
    numberOfCards: shuffledDeck.length,
    isGameActive,
    setIsDisabled,
  });

  // only shuffle deck once, not once per render
  if (shuffledDeck.length === 0) {
    const shuffled = shuffle();
    const spreaded = spread(shuffled);
    setShuffledDeck(spreaded);
  }

  // collapsed spread deck into stacked deck after game starts,
  // then deal out to grid only once, not once per render
  if (gameStatus === STATUSES.STACKING) {
    const stackedDeck = stack(shuffledDeck);
    setShuffledDeck(stackedDeck);
    setGameStatus(STATUSES.DEALING);
    setTimeout(() => {
      const dealt = deal(shuffledDeck);
      setShuffledDeck(dealt);
      setGameStatus(STATUSES.PLAYING);
    }, ONE_SECOND * 1.5);
  }

  let clicksToMatches = getPrecision((numMatches / numClicks) * 100);
  if (isNaN(clicksToMatches) && numClicks === 0) {
    clicksToMatches = 0.0;
  }
  let clicksPerSecond = getPrecision(numClicks / numSeconds);
  if (isNaN(clicksPerSecond) && numSeconds === 0) {
    clicksPerSecond = 0.0;
  }
  const template = `${clicksToMatches}% click-to-match ratio | ${clicksPerSecond} clicks per second`;
  if (template !== endStats) {
    setEndStats(template);
  }

  if (allMatchesFound) {
    setGameStatus(STATUSES.GAME_OVER);
    setButtonLabel(LABELS.GAME_OVER);
  }

  if (cardHistory.length === 2) {
    checkForMatch();
  }

  const clickIncrementor = () => {
    if (!isGameActive) return;
    setNumClicks(numClicks + 1);
  };

  const buttonHandler = () => {
    if (!isGameStarted) {
      // just starting
      setGameStatus(STATUSES.STACKING);
      setButtonLabel(LABELS.PAUSE);
      return;
    }
    if (isGameActive) {
      // about to pause
      setButtonLabel(LABELS.RESUME);
      setShowOverlay(true);
      setGameStatus(STATUSES.PAUSING);
      return;
    }
    if (gameStatus === STATUSES.PAUSING) {
      // about to resume
      setButtonLabel(LABELS.PAUSE);
      setGameStatus(STATUSES.PLAYING);
      setShowOverlay(false);
    }
  };

  useInterval(
    () => {
      setNumSeconds((numSeconds) => numSeconds + 1);
    },
    isGameActive ? ONE_SECOND : null,
  );

  const overlayClasses = classnames({
    overlay: true,
    'p-4': true,
    hidden: !showOverlay,
  });

  const wrapperClasses = classnames({
    cardsWrapper: true,
    spread: gameStatus === STATUSES.INITIAL,
    stacked: gameStatus === STATUSES.STACKING,
    dealt: gameStatus >= STATUSES.DEALING,
  });

  return (
    <div className='w-full'>
      <div className='pb-4'>
        <input
          type='button'
          className='button'
          value={buttonLabel}
          onClick={buttonHandler}
          disabled={gameStatus === STATUSES.GAME_OVER}
        />
      </div>
      <div
        className={wrapperClasses}
        style={
          {
            '--animation-duration': `${(ANIMATION_DURATION / 2 / 1000).toFixed(2)}s`,
            '--card-width': `${CARDS.WIDTH}px`,
            '--card-height': `${CARDS.HEIGHT}px`,
          } as React.CSSProperties
        }
      >
        {shuffledDeck.length > 0 &&
          shuffledDeck.map((card, index) => {
            return (
              <Card
                style={card.style}
                key={`card-${index}`}
                face={card.face}
                suit={card.suit}
                color={card.color}
                isPlaying={isGameStarted}
                disabled={!isGameStarted || isDisabled}
                clickIncrementor={clickIncrementor}
                updateCardHistory={updateCardHistory}
              />
            );
          })}
        {isGameStarted && <div className={overlayClasses}></div>}
      </div>
      {isGameStarted && (
        <>
          <Scoring
            gameStarted={isGameStarted}
            numClicks={numClicks}
            numMatches={numMatches}
            numSeconds={numSeconds}
            endStats={endStats}
          />
        </>
      )}
    </div>
  );
}
