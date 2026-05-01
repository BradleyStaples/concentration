import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import './game.css';

const geistSans = Geist({variable: '--font-geist-sans', subsets: ['latin']});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
