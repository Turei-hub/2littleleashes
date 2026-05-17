// src/app/gallery/page.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GalleryCarousel from '@/components/GalleryCarousel'

export const metadata: Metadata = {
  title: 'Gallery | 2 Little Leashes Rotorua',
  description: 'Photos from walks and visits with 2 Little Leashes dog walkers in Rotorua, NZ.',
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
