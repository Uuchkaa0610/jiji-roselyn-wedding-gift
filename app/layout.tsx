import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://wedding-memory-keepsake.uuchkaa0610.chatgpt.site');

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

const editorial = Cormorant_Garamond({
  variable: '--font-editorial',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Jiji & Roselyn — A Wedding Gift Made With Love',
  description:
    'A timeless white-and-gold wedding keepsake for a lifetime of beautiful memories.',
  openGraph: {
    title: 'Jiji & Roselyn — A Celebration of Forever',
    description: 'A beautiful home for a lifetime of memories.',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jiji & Roselyn — A Celebration of Forever',
    description: 'A beautiful home for a lifetime of memories.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${editorial.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
