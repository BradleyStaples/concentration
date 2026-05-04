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
      <body className={`${arapey.variable} antialiased`}>{children}</body>
    </html>
  );
}
