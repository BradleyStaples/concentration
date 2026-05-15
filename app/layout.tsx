import type {Metadata} from 'next';
import {Arapey} from 'next/font/google';
import './globals.css';
import './game.css';

const arapey = Arapey({
  variable: '--font-arapey',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Concentration',
  description: 'Concentration by Bradley Staples',
};

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang='en'>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src='http://localhost:8097'></script>
      </head>
      <body className={`${arapey.variable} antialiased`}>
        <div className='flex min-h-screen items-start justify-center'>
          <main className='relative flex w-full max-w-5xl flex-col items-start justify-start sm:items-start'>
            <div className='flex w-full flex-col items-center gap-6 sm:items-start'>
              <h1 className='py-6 text-2xl tracking-tight'>
                Concentration{' '}
                <span className='text-xl'>
                  by <a href='https://bradleystaples.com'>Bradley Staples</a>.
                </span>
              </h1>
            </div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
