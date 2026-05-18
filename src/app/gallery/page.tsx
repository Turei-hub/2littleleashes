// src/app/gallery/page.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GalleryCarousel from '@/components/GalleryCarousel'

export const metadata: Metadata = {
  title: 'Gallery | 2 Little Leashes Dog Walkers Rotorua',
  description: 'See photos from walks, washes and adventures with happy dogs around Rotorua. Real photos from real walks — updated regularly.',
  alternates: { canonical: 'https://2littleleashes.co.nz/gallery' },
  openGraph: {
    title: 'Gallery | 2 Little Leashes Dog Walkers Rotorua',
    description: 'See photos from walks, washes and adventures with happy dogs around Rotorua. Real photos from real walks.',
    url: 'https://2littleleashes.co.nz/gallery',
    images: [{ url: '/images/dog-walk-rotorua.jpg', width: 1200, height: 630, alt: '2 Little Leashes dog walk in Rotorua' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery | 2 Little Leashes Dog Walkers Rotorua',
    description: 'See photos from walks, washes and adventures with happy dogs around Rotorua.',
    images: ['/images/dog-walk-rotorua.jpg'],
  },
}

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <section className="bg-forest-700 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Gallery</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white">Happy dogs on happy walks</h1>
          <p className="mt-3 max-w-xl text-sm text-white/65">
            Real photos from real walks — click any photo to expand. Auto-plays every 3 seconds.
          </p>
        </div>
      </section>

      <GalleryCarousel />

      <Footer />
    </>
  )
}
