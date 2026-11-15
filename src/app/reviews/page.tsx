// src/app/reviews/page.tsx
// All approved reviews + the public "Leave a review" form.

import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ReviewCard from '@/components/ReviewCard'
import ReviewForm from '@/components/ReviewForm'
import { getContent } from '@/lib/content'
import { getApprovedReviews } from '@/lib/reviews'

export const metadata: Metadata = {
  title: 'Reviews', // layout template appends " | 2 Little Leashes Rotorua"
  description: 'Read what Rotorua dog owners say about 2 Little Leashes — and leave a review of your own.',
  alternates: { canonical: 'https://www.2littleleashes.co.nz/reviews' },
  openGraph: {
    title: 'Reviews | 2 Little Leashes Dog Walkers Rotorua',
    description: 'Read what Rotorua dog owners say about 2 Little Leashes.',
    url: 'https://www.2littleleashes.co.nz/reviews',
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/dog-walk-rotorua.jpg`, width: 1200, height: 630, alt: '2 Little Leashes dog walk in Rotorua' }],
  },
}

export default async function ReviewsPage() {
  const [c, reviews] = await Promise.all([getContent(), getApprovedReviews()])

  return (
    <>
      <Navbar />

      <section className="bg-forest-700 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">{c['home.reviews.eyebrow']}</p>
          <h1 className="font-display mt-1 text-2xl font-bold text-white sm:text-4xl">{c['home.reviews.heading']}</h1>
          <p className="mt-3 max-w-xl text-sm text-white">{c['home.reviews.subheading']}</p>
          <a href="#leave-review" className="btn-primary mt-6 w-full justify-center bg-amber-500 hover:bg-amber-400 sm:w-auto">
            Leave a review
          </a>
        </div>
      </section>

      <section className="bg-forest-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {reviews.length === 0 ? (
            <p className="text-center text-sm text-forest-600">No reviews yet — be the first!</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
            </div>
          )}
        </div>
      </section>

      <section id="leave-review" className="scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-forest-700">Leave a review</h2>
          <p className="mb-6 mt-2 text-sm text-forest-600">
            Had a walk, wash or check-in with us? We&apos;d love to hear how it went.
          </p>
          <ReviewForm />
        </div>
      </section>

      <Footer />
    </>
  )
}
