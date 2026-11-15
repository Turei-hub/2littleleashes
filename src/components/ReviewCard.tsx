// src/components/ReviewCard.tsx
// One public review card — used on the homepage and /reviews.

import type { Review } from '@/lib/reviews'

const SOURCE_LABEL: Record<string, string> = {
  facebook: 'Facebook review',
  website:  'Website review',
}

export function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <div className={`text-lg tracking-tight text-amber-400 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}
      <span className="text-forest-700/15">{'★'.repeat(5 - rating)}</span>
    </div>
  )
}

export default function ReviewCard({ review }: { review: Pick<Review, 'name' | 'dog_name' | 'body' | 'rating' | 'source'> }) {
  const initials = review.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase())
    .join('')
  const subtitle = [review.dog_name ? `${review.dog_name}'s human` : null, SOURCE_LABEL[review.source]]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="flex flex-col rounded-xl border border-forest-700/10 bg-white p-6 shadow-sm">
      {review.rating ? <Stars rating={review.rating} className="mb-3" /> : null}
      <p className="flex-1 whitespace-pre-line break-words text-sm leading-relaxed text-forest-600">&ldquo;{review.body}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3 border-t border-forest-700/8 pt-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-100 text-xs font-bold text-forest-700">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-forest-700">{review.name}</p>
          {subtitle && <p className="text-xs text-forest-600">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
