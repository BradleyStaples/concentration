'use client';
import {useState} from 'react';
import classnames from 'classnames';

import Card from './Card';
import Scoring from './Scoring';
import useInterval from '../hooks/useInterval';
import type {BaseCard, CardHistory} from '../utils/types';
import shuffle from '../utils/shuffle';
import spread from '../utils/spread';

export const ANIMATION_DURATION = 1500;
const ONE_SECOND = 1000;

const LABELS = {
  START: 'Start',
  PAUSE: 'Pause',
  RESUME: 'Resume',
  GAME_OVER: 'Game Over',
};

const STATUSES = {PRE_START: 0, PLAYING: 1, PAUSED: 2, GAME_OVER: 3};

// TODOs:
// - make a `deal` utility that animates from `spread` to css grid
// - rework `Card` to handle more state internally?
// - make 404 route

export default function Game() {
  const getPrecision = (value: number, precision: number = 2) => {
    return parseFloat(value.toFixed(precision));
  };
  const [buttonLabel, setButtonLabel] = useState(LABELS.START);
  const [showOverlay, setShowOverlay] = useState(false);
  const [numClicks, setNumClicks] = useState(0);
  const [numSeconds, setNumSeconds] = useState(0);
  const [numMatches, setNumMatches] = useState(0);
  const [endStats, setEndStats] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [cardHistory, setCardHistory] = useState<CardHistory[]>([]);
  const [shuffledDeck, setShuffledDeck] = useState<BaseCard[]>([]);
  const [gameStatus, setGameStatus] = useState(STATUSES.PRE_START);

  const isGameStarted = gameStatus > STATUSES.PRE_START;
  const isGameActive = gameStatus === STATUSES.PLAYING;

  // only shuffle deck once, not once per render
  if (shuffledDeck.length === 0) {
    const shuffled = shuffle();
    const spreaded = spread(shuffled);
    setShuffledDeck(spreaded);
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

  if (isGameActive && numMatches === shuffledDeck.length / 2) {
    // game is over, all matches found
    setGameStatus(STATUSES.GAME_OVER);
    setButtonLabel(LABELS.GAME_OVER);
  }

  if (cardHistory.length === 2) {
    // compare new card to existing card for a match
    const oldCard = cardHistory[0];
    const newCard = cardHistory[1];
    if (oldCard.suit === newCard.suit && oldCard.face === newCard.face) {
      setNumMatches((numMatches) => numMatches + 1);
    } else {
      // not a match; disable while faceup, return to facedown
      setIsDisabled(true);
      setTimeout(() => {
        oldCard.setIsFaceup(false);
        newCard.setIsFaceup(false);
        setIsDisabled(false);
      }, ANIMATION_DURATION);
    }
    // reset history
    setCardHistory([]);
  }

  const clickIncrementor = () => {
    if (!isGameActive) return;
    setNumClicks(numClicks + 1);
  };

  const updateCardHistory = (newHistory: CardHistory) => {
    if (!isGameActive) return;
    if (cardHistory.length <= 1) {
      setCardHistory((cardHistory) => cardHistory.concat(newHistory));
    }
  };

  const buttonHandler = () => {
    if (!isGameStarted) {
      // just starting
      setGameStatus(STATUSES.PLAYING);
      setButtonLabel(LABELS.PAUSE);
      return;
    }
    if (isGameActive) {
      // about to pause
      setButtonLabel(LABELS.RESUME);
      setShowOverlay(true);
      setGameStatus(STATUSES.PAUSED);
      return;
    }
    if (gameStatus === STATUSES.PAUSED) {
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
    deck: !isGameStarted,
    'cardframe grid grid-cols-8 content-start justify-between gap-4 p-4':
      isGameStarted,
  });

  return (
    <div className='w-full'>
      {isGameStarted && (
        <div className='pb-4'>
          <input
            type='button'
            className='button'
            value={buttonLabel}
            onClick={buttonHandler}
            disabled={gameStatus === STATUSES.GAME_OVER}
          />
        </div>
      )}
      <div
        className={wrapperClasses}
        style={
          isGameStarted
            ? ({
                '--animation-duration': `${(ANIMATION_DURATION / 2 / 1000).toFixed(2)}s`,
              } as React.CSSProperties)
            : undefined
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
      {!isGameStarted && (
        <input
          type='button'
          className='button'
          value={buttonLabel}
          onClick={buttonHandler}
        />
      )}
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
