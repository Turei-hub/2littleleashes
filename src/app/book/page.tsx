import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingFlowClient from '@/components/BookingFlowClient'

export const metadata: Metadata = {
  title: 'Book a Walk | 2 Little Leashes Rotorua',
  description: 'Book dog walking, washing, home check-ins or endurance runs in Rotorua. First walk FREE for new customers.',
}

export default function BookPage() {
  return (
    <>
      <Navbar />

      <section className="bg-forest-700 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">New booking</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white">Book with 2 Little Leashes</h1>
          <p className="mt-3 max-w-xl text-sm text-white/65">
            New customers get their <strong className="text-amber-300">first walk FREE</strong>. Returning customers can book any service below. Enter your email to get started.
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
