import type { Metadata } from 'next'
import './globals.css'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTop from '@/components/BackToTop'
import CookieConsent from '@/components/CookieConsent'

export const metadata: Metadata = {
  title: 'Everlasting Store - Premium Fashion & Perfumes',
  description: 'Shop premium perfumes, abayas, jalabiya, slides and fashion at Everlasting Store. Fast delivery across Nigeria.',
  keywords: 'perfumes, abayas, jalabiya, slides, fashion, Nigeria, online store',
  openGraph: {
    title: 'Everlasting Store - Premium Fashion & Perfumes',
    description: 'Shop premium perfumes, abayas, jalabiya, slides and fashion. Fast delivery across Nigeria.',
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
      <body style={{background: '#fdf8f0', minHeight: '100vh'}}>
        {children}
        <WhatsAppButton />
        <BackToTop />
        <CookieConsent />
      </body>
    </html>
  )
}
