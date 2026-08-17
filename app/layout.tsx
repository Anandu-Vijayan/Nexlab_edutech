import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { Providers } from '@/components/Providers';
import { StructuredData } from '@/components/StructuredData';
import '@/app/globals.css';

const GA_MEASUREMENT_ID: string | undefined = process.env.NEXT_PUBLIC_GA_ID;

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nexlab.in'),
  title: {
    default: "NeXlab — India's First Immersive Learning Platform",
    template: '%s | NeXlab',
  },
  description:
    "NeXlab is India's first immersive learning platform delivering next-level, hands-on educational experiences through VR, AR, AI tutors, and AVGC studios.",
  keywords: [
    'immersive learning',
    'VR education',
    'AR learning',
    'XR education',
    'Kerala EdTech',
    'AVGC courses',
    'AI tutors',
    'game design courses',
    'animation courses India',
    'virtual reality school',
  ],
  authors: [{ name: 'NeXlab Edu Hub' }],
  creator: 'NeXlab',
  publisher: 'NeXlab Edu Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://nexlab.in',
    siteName: 'NeXlab Edu Hub',
    title: "NeXlab — India's First Immersive Learning Platform",
    description:
      "India's first immersive learning platform delivering next-level, hands-on educational experiences.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeXlab - Immersive Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "NeXlab — India's First Immersive Learning Platform",
    description:
      "India's first immersive learning platform delivering next-level, hands-on educational experiences.",
    images: ['/og-image.png'],
    creator: '@nexlab',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
      {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
