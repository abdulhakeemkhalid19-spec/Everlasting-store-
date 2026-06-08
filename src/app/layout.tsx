import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Everlasting Store - Premium Fashion & Perfumes',
  description: 'Shop premium perfumes, abayas, jalabiya, slides and fashion at Everlasting Store',
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
      </body>
    </html>
  )
}
