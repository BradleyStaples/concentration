import {Arapey} from 'next/font/google';
import '../app/globals.css';

const arapey = Arapey({
  variable: '--font-arapey',
  weight: '400',
  subsets: ['latin'],
});

export default function Custom404() {
  return (
    <html lang='en'>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src='http://localhost:8097'></script>
      </head>
      <body className={`${arapey.variable} antialiased`}>
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
            <h1>404 - Not Found</h1>
          </main>
        </div>
      </body>
    </html>
  );
}
