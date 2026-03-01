import type { Metadata, Viewport } from 'next';
import { Roboto_Slab } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: 'Daily Brief - News Quiz',
  description: 'Test your knowledge of daily news with our engaging quiz platform',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alyamama:wght@300..900&family=Bpmf+Iansui&family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={robotoSlab.variable}>
        <ThemeProvider>
          <main className="min-h-screen bg-background text-foreground">
            <Header />
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
