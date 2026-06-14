import type { Metadata } from 'next'
import './globals.css'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTop from '@/components/BackToTop'
import CookieConsent from '@/components/ CookieConsent'
import PushNotificationInit from '@/components/PushNotificationInit'
// inside <body>:
<PushNotificationInit />

export const metadata: Metadata = {
  title: 'Everlasting Store - Premium Fashion & Perfumes',
  description: 'Shop premium perfumes, abayas, jalabiya, slides, fashion, Nigeria',
  keywords: 'perfumes, abayas, jalabiya, slides, fashion, Nigeria',
  manifest: '/manifest.json',
  themeColor: '#1E90FF',
  openGraph: {
    title: 'Everlasting Store - Premium Fashion & Perfumes',
    description: 'Shop premium perfumes, abayas, jalabiya, slides, fashion, Nigeria',
    url: 'https://everlastingstore.vercel.app',
    siteName: 'Everlasting Store',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E90FF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Everlasting" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body style={{ background: '#fdf8f0', minHeight: '100vh' }}>
        {children}
        <WhatsAppButton />
        <BackToTop />
        <CookieConsent />
      </body>
    </html>
  )
}
