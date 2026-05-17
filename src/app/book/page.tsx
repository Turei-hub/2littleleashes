// src/app/book/page.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingForm from '@/components/BookingForm'

export const metadata: Metadata = {
  title: 'Book a Walk | 2 Little Leashes Rotorua',
  description: 'Book dog walking, washing, home check-ins or endurance runs in Rotorua. First walk FREE. Instant email confirmation.',
}

export default function BookPage() {
  return (
    <>
      <Navbar />

      <section className="bg-forest-700 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">New booking</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white">Book a walk or service</h1>
          <p className="mt-3 text-white/65 text-sm max-w-xl">
            Fill in the form below. You'll receive an instant confirmation email, and Meihana will be in touch within 24 hours to arrange your free meet &amp; greet.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <BookingForm />
      </div>

      <Footer />
    </>
  )
}
