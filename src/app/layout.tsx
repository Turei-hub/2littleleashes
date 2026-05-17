// src/app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import BackToTop from '@/components/BackToTop'

const playfair = Playfair_Display({
  subsets:  ['latin'],
  variable: '--font-display',
  weight:   ['600', '700'],
  style:    ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-sans',
  weight:   ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title:       '2 Little Leashes Dog Walkers | Rotorua, NZ',
  description: 'Professional dog walking, washing, home check-ins and endurance runs in Rotorua, New Zealand. GPS-tracked, photo updates every session. First walk FREE.',
  keywords:    ['dog walking Rotorua', 'dog walker Rotorua NZ', 'pet care Rotorua', '2 little leashes'],
  openGraph: {
    title:       '2 Little Leashes Dog Walkers | Rotorua, NZ',
    description: 'Professional dog walking and caring in Rotorua. GPS-tracked, photo updates, first walk FREE.',
    type:        'website',
    locale:      'en_NZ',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-cream font-sans text-forest-700 antialiased">
        {children}
        <BackToTop />
      </body>
    </html>
  )
}
