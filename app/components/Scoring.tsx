import classnames from 'classnames';

interface Props {
  gameStarted: boolean;
  numClicks: number;
  numMatches: number;
  numSeconds: number;
  endStats: string;
}

const Scoring = ({
  gameStarted,
  numClicks,
  numMatches,
  numSeconds,
  endStats,
}: Props) => {
  const counter = (count: number, singularNoun: string, pluralNoun: string) => {
    if (!gameStarted) return null;
    if (count === 1) return `1 ${singularNoun}`;
    return `${count} ${pluralNoun}`;
  };
  const scoreClasses = classnames({score: true, hidden: !gameStarted});

  return (
    <div className={scoreClasses}>
      <span className='clicks'>{counter(numClicks, 'click', 'clicks')}</span>
      <span className='matches'>{counter(numMatches, 'match', 'matches')}</span>
      <span className='time'>{counter(numSeconds, 'second', 'seconds')}</span>
      <span className='stats'>{endStats}</span>
    </div>
  );
};

export default Scoring;
