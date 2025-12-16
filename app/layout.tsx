import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Levrok Labs - Private. Equitable. Transparent.',
  description: 'Levrok Labs - AI Agency engineering intelligent solutions for tomorrow\'s challenges',
  icons: {
    icon: '/favicon.ico',// to be changed with logo
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}

