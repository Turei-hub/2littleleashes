import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingForm from '@/components/BookingForm'
import { getContent } from '@/lib/content'
import { bookingServices } from '@/lib/content-defaults'

export const metadata: Metadata = {
  title: 'Book a Walk | 2 Little Leashes Rotorua',
  description: 'Book dog walking, washing, or home check-ins in Rotorua. Easy online booking.',
  alternates: { canonical: 'https://www.2littleleashes.co.nz/book' },
  openGraph: {
    title: 'Book a Walk | 2 Little Leashes Rotorua',
    description: 'Book dog walking, washing, or home check-ins in Rotorua. Easy online booking.',
    url: 'https://www.2littleleashes.co.nz/book',
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/dog-walk-rotorua.jpg`, width: 1200, height: 630, alt: '2 Little Leashes dog walk in Rotorua' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Walk | 2 Little Leashes Rotorua',
    description: 'Book dog walking, washing, or home check-ins in Rotorua. Easy online booking.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/images/dog-walk-rotorua.jpg`],
  },
}

export default async function BookPage() {
  const c = await getContent()

  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden bg-forest-700 px-4 py-14 min-h-96 sm:px-6 lg:px-8">
        <Image
          src={c['book.hero.image']}
          alt="Dog walk in Rotorua"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 35%' }}
          priority
        />
        <div className="absolute inset-0 bg-forest-700/80" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">{c['book.hero.eyebrow']}</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white">{c['book.hero.heading']}</h1>
          <p className="mt-3 max-w-xl text-sm text-white">
            {c['book.hero.subtitle']}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <BookingForm services={bookingServices(c)} nextSteps={c['book.success.next']} />
      </div>

      <Footer />
    </>
  )
}
