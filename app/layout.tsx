import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { StoreProvider } from '@/lib/store'
import { ToastProvider } from '@/lib/toast'
import { PwaInstall } from '@/components/pwa-install'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "TimeHub — Luxury Timepieces",
  description:
    'Discover premium luxury watches. Chronographs, divers, skeletons and classic dress watches. Secure checkout with Razorpay.',
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',

  verification: {
    google: 'E76PXWjXunkI8elP7feLxqkcq9qbCsTJrGXqPnp70i0',
  },

  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TimeHub',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#282420',
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <StoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </StoreProvider>
        <PwaInstall />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
