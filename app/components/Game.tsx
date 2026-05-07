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

// TODOs:
// - make a `deal` utility that animates from `spread` to css grid
// - rework `Card` to handle more state internally?
// - make 404 route

export default function Game() {
  const getPrecision = (value: number, precision: number = 2) => {
    return parseFloat(value.toFixed(precision));
  };

  const [gameStarted, setGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Start');
  const [showOverlay, setShowOverlay] = useState(false);
  const [numClicks, setNumClicks] = useState(0);
  const [numSeconds, setNumSeconds] = useState(0);
  const [numMatches, setNumMatches] = useState(0);
  const [endStats, setEndStats] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [cardHistory, setCardHistory] = useState<CardHistory[]>([]);
  const [shuffledDeck, setShuffledDeck] = useState<BaseCard[]>([]);

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

  if (isPlaying && numMatches === shuffledDeck.length / 2) {
    // game is over, all matches found
    setIsPlaying(false);
    setButtonLabel('Game Over');
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
    setNumClicks(numClicks + 1);
  };

  const updateCardHistory = (newHistory: CardHistory) => {
    if (cardHistory.length <= 1) {
      setCardHistory((cardHistory) => cardHistory.concat(newHistory));
    }
  };

  const buttonHandler = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (isPlaying) {
      // about to pause, set label to resume
      setButtonLabel('Resume');
      setShowOverlay(true);
    } else {
      // about to resume, set label to pause
      setButtonLabel('Pause');
      setShowOverlay(false);
    }
    setIsPlaying((isPlaying) => !isPlaying);
  };

  useInterval(
    () => {
      setNumSeconds((numSeconds) => numSeconds + 1);
    },
    isPlaying ? ONE_SECOND : null,
  );

  if (!gameStarted) {
    return (
      <div>
        <div className='deck'>
          {shuffledDeck.length > 0 &&
            shuffledDeck.map((card, index) => {
              return (
                <Card
                  style={card.style}
                  key={`static-card-${index}`}
                  isPlaying={false}
                  face={card.face}
                  suit={card.suit}
                  color={card.color}
                  disabled={true}
                />
              );
            })}
        </div>
        <input
          type='button'
          className='button'
          value={buttonLabel}
          onClick={buttonHandler}
          disabled={buttonLabel === 'Game Over'}
        />
      </div>
    );
  }

  const overlayClasses = classnames({
    overlay: true,
    'p-4': true,
    hidden: !showOverlay,
  });

  return (
    <div>
      <div className='pb-4'>
        <input
          type='button'
          className='button'
          value={buttonLabel}
          onClick={buttonHandler}
          disabled={buttonLabel === 'Game Over'}
        />
      </div>
      <div
        className='cardframe grid grid-cols-8 content-start justify-between gap-4 p-4'
        style={
          {
            '--animation-duration': `${(ANIMATION_DURATION / 2 / 1000).toFixed(2)}s`,
          } as React.CSSProperties
        }
      >
        {shuffledDeck.length > 0 &&
          shuffledDeck.map((card, index) => {
            return (
              <Card
                face={card.face}
                suit={card.suit}
                color={card.color}
                key={`card-${index}`}
                isPlaying={isPlaying}
                disabled={isDisabled}
                clickIncrementor={clickIncrementor}
                updateCardHistory={updateCardHistory}
              />
            );
          })}
        <div className={overlayClasses}></div>
      </div>
      <Scoring
        gameStarted={gameStarted}
        numClicks={numClicks}
        numMatches={numMatches}
        numSeconds={numSeconds}
        endStats={endStats}
      />
    </div>
  );
}
