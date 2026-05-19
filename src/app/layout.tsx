// src/app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import BackToTop from '@/components/BackToTop'
import AdminFloatingButton from '@/components/AdminFloatingButton'

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

const SITE_URL = 'https://2littleleashes.co.nz'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  '2 Little Leashes Dog Walkers | Rotorua, NZ',
    template: '%s | 2 Little Leashes Rotorua',
  },
  description: 'Professional dog walking, washing, home check-ins and Sunday endurance runs in Rotorua, New Zealand. GPS-tracked, photo update every session. First walk FREE for new clients.',
  keywords: ['dog walking Rotorua', 'dog walker Rotorua NZ', 'pet care Rotorua', 'dog wash Rotorua', '2 little leashes', 'Meihana dog walker'],
  openGraph: {
    siteName:    '2 Little Leashes',
    type:        'website',
    locale:      'en_NZ',
    url:         SITE_URL,
    title:       '2 Little Leashes Dog Walkers | Rotorua, NZ',
    description: 'Professional dog walking and caring in Rotorua. GPS-tracked, photo update every session. First walk FREE.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: '2 Little Leashes dog walkers Rotorua' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       '2 Little Leashes Dog Walkers | Rotorua, NZ',
    description: 'Professional dog walking and caring in Rotorua. GPS-tracked, photo update every session. First walk FREE.',
    images:      ['/og-image.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: '2 Little Leashes',
  description: 'Professional dog walking, washing, home check-ins and Sunday endurance runs in Rotorua, New Zealand.',
  url: 'https://2littleleashes.co.nz',
  email: 'milner.turei@gmail.com',
  image: 'https://2littleleashes.co.nz/images/dog-walk-rotorua.jpg',
  logo: 'https://2littleleashes.co.nz/images/logo.png',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Rotorua',
    addressRegion: 'Bay of Plenty',
    addressCountry: 'NZ',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -38.1368,
    longitude: 176.2497,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '14:00',
    },
  ],
  priceRange: '$$',
  areaServed: { '@type': 'City', name: 'Rotorua' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Dog Care Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dog Walking', description: 'Group walks from $30. First walk FREE for new clients.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dog Wash', description: 'Wash and dry from $20.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Home Check-ins', description: 'Home visits from $20.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sunday Endurance Run', description: '10 km+ trail run from $50.' } },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NZ" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-cream font-sans text-forest-700 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <BackToTop />
        <AdminFloatingButton />
      </body>
    </html>
  )
}
