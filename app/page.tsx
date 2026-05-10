import Game from './components/Game';

export default function Home() {
  return (
    <div className='flex min-h-screen items-start justify-center'>
      <main className='relative flex w-full max-w-5xl flex-col items-start justify-start sm:items-start'>
        <div className='flex w-full flex-col items-center gap-6 text-center sm:items-start sm:text-left'>
          <h1 className='py-6 text-2xl tracking-tight'>
            Concentration{' '}
            <span className='text-xl'>
              by <a href='https://bradleystaples.com'>Bradley Staples</a>.
            </span>
          </h1>
        </div>
        <Game />
      </main>
    </div>
  );
}
