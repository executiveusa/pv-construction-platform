import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { RootLayoutClient } from '@/components/RootLayoutClient'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Synthia Design Studio — Premium Design + Directory Infrastructure',
  description: 'Luxury design studio + directory infrastructure for SaaS founders. UDEC 8.5+ quality floor. Build directories and marketplaces that make money.',
  openGraph: {
    title: 'Synthia Design Studio — Premium Design + Directory Infrastructure',
    description: 'Luxury design studio + directory infrastructure for SaaS founders. UDEC 8.5+ quality floor.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-sans">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}