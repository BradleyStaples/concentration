import Game from './components/Game';

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 font-sans dark:bg-black'>
      <main className='relative flex max-w-5xl flex-col items-start justify-start bg-white sm:items-start dark:bg-black'>
        <div className='flex w-full flex-col items-center gap-6 text-center sm:items-start sm:text-left'>
          <h1 className='py-6 text-2xl font-semibold tracking-tight text-black dark:text-slate-50'>
            Concentration{' '}
            <span className='text-base font-medium'>
              by{' '}
              <a
                href='https://bradleystaples.com'
                className='text-sky-500 dark:text-sky-300'
              >
                Bradley Staples
              </a>
              .
            </span>
          </h1>
        </div>
        <Game />
      </main>
    </div>
  );
}
