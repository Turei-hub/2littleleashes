// src/app/gallery/page.tsx
export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GalleryCarousel from '@/components/GalleryCarousel'
import GalleryShareButton from '@/components/GalleryShareButton'
import { createAdminClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Gallery | 2 Little Leashes Dog Walkers Rotorua',
  description: 'See photos from walks, washes and adventures with happy dogs around Rotorua. Real photos from real walks — updated regularly.',
  alternates: { canonical: 'https://www.2littleleashes.co.nz/gallery' },
  openGraph: {
    title: 'Gallery | 2 Little Leashes Dog Walkers Rotorua',
    description: 'See photos from walks, washes and adventures with happy dogs around Rotorua. Real photos from real walks.',
    url: 'https://www.2littleleashes.co.nz/gallery',
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/dog-walk-rotorua.jpg`, width: 1200, height: 630, alt: '2 Little Leashes dog walk in Rotorua' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery | 2 Little Leashes Dog Walkers Rotorua',
    description: 'See photos from walks, washes and adventures with happy dogs around Rotorua.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/images/dog-walk-rotorua.jpg`],
  },
}

export default async function GalleryPage() {
  const { data: approved, error } = await createAdminClient()
    .from('gallery_submissions')
    .select('image_url, dog_name, caption, status')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const extraImages = (approved ?? []).map(s => ({
    src: s.image_url as string,
    alt: s.caption ? `${s.dog_name} — ${s.caption}` : (s.dog_name as string),
  }))

  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden bg-forest-700 px-4 py-14 min-h-96 sm:px-6 lg:px-8">
        <Image
          src="/images/dog-walk-rotorua.jpg"
          alt="Dog walk in Rotorua"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 35%' }}
          priority
        />
        <div className="absolute inset-0 bg-forest-700/80" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Gallery</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white">Happy dogs on happy walks</h1>
          <p className="mt-3 max-w-xl text-sm text-white">
            Real photos from real walks — click any photo to expand. Auto-plays every 3 seconds.
          </p>
          <div className="mt-6">
            <GalleryShareButton />
          </div>
        </div>
      </section>

      <GalleryCarousel extra={extraImages} />

      <Footer />
    </>
  )
}
