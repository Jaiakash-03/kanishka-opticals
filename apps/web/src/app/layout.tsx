import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import '@/app/globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const STORE_NAME = process.env['NEXT_PUBLIC_STORE_NAME'] ?? 'Kanishka Opticals';

export const metadata: Metadata = {
  title: {
    default: `${STORE_NAME} — Premium Eyewear in Coimbatore`,
    template: `%s | ${STORE_NAME}`,
  },
  description:
    'Shop premium eyeglasses, sunglasses, contact lenses and accessories. Book an eye test at Kanishka Opticals, Coimbatore. Quality eyewear for the whole family.',
  keywords: [
    'eyeglasses', 'sunglasses', 'contact lenses', 'optical store',
    'Coimbatore', 'prescription glasses', 'eye test', 'Kanishka Opticals',
  ],
  metadataBase: new URL('https://kanishkaopticals.in'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://kanishkaopticals.in',
    siteName: STORE_NAME,
    title: `${STORE_NAME} — Premium Eyewear in Coimbatore`,
    description: 'Shop premium eyeglasses, sunglasses and contact lenses. Book an eye test today.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: STORE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${STORE_NAME} — Premium Eyewear`,
    description: 'Shop premium eyeglasses, sunglasses and contact lenses in Coimbatore.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#3f5ef8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          {/* Skip to main content — accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>

          <Header />

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <Footer />
          <CartDrawer />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </Providers>
      </body>
    </html>
  );
}

