// src/app/gallery/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Gallery | 2 Little Leashes Rotorua',
  description: 'Photos from walks and visits with 2 Little Leashes dog walkers in Rotorua, NZ.',
}

const IMAGES = Array.from({ length: 15 }, (_, i) => `dog-photo-${i + 1}.jpg`)

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <section className="bg-forest-700 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Gallery</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white">Happy dogs on happy walks</h1>
          <p className="mt-3 max-w-xl text-sm text-white/65">
            Real photos from real walks — because every dog deserves a great adventure.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {IMAGES.map((filename) => (
            <div key={filename} className="mb-4 overflow-hidden rounded-xl break-inside-avoid">
              <Image
                src={`/images/${filename}`}
                alt="Dog walk photo"
                width={600}
                height={600}
                className="w-full object-cover transition duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}
