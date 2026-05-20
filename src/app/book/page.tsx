import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingFlowClient from '@/components/BookingFlowClient'

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

export default function BookPage() {
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
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">New booking</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white">Book with 2 Little Leashes</h1>
          <p className="mt-3 max-w-xl text-sm text-white">
            Enter your email to get started — we'll get you booked in no time.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <BookingFlowClient />
      </div>

      <Footer />
    </>
  )
}
