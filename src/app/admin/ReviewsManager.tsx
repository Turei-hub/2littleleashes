'use client'
// src/app/admin/ReviewsManager.tsx
// "Reviews" tab: filter by status, approve / hide / delete, and add reviews
// pasted in from Facebook or elsewhere (saved as approved).

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Check, EyeOff, Loader, Plus, Trash2 } from 'lucide-react'
import type { Review, ReviewStatus } from '@/lib/reviews'
import { REVIEW_LIMITS } from '@/lib/reviews'
import { Stars } from '@/components/ReviewCard'
import { StarPicker } from '@/components/ReviewForm'
import { addReview, deleteReview, setReviewStatus } from './review-actions'

const FILTERS: { value: ReviewStatus; label: string; activeClass: string }[] = [
  { value: 'pending',  label: 'Pending',  activeClass: 'bg-amber-500 text-white' },
  { value: 'approved', label: 'Approved', activeClass: 'bg-green-600 text-white' },
  { value: 'hidden',   label: 'Hidden',   activeClass: 'bg-gray-500 text-white' },
]

const SOURCE_BADGE: Record<string, { label: string; cls: string }> = {
  website:  { label: 'Website',  cls: 'bg-teal-100 text-teal-700' },
  facebook: { label: 'Facebook', cls: 'bg-blue-100 text-blue-700' },
  admin:    { label: 'Added by you', cls: 'bg-forest-100 text-forest-700' },
}

export default function ReviewsManager({
  reviews,
  activeStatus,
  counts,
}: {
  reviews: Review[]
  activeStatus: ReviewStatus
  counts: Record<ReviewStatus, number>
}) {
  return (
    <>
      <div className="mb-6 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
        Only approve genuine reviews. Don&apos;t hide honest negative reviews - NZ Fair Trading Act.
      </div>

      <AddReviewForm />

      <div className="mb-4 mt-8 flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <Link
            key={f.value}
            href={`/admin?tab=reviews&status=${f.value}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              activeStatus === f.value ? f.activeClass : 'bg-white text-forest-600 hover:bg-forest-100'
            }`}
          >
            {f.label} ({counts[f.value]})
          </Link>
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-forest-700/10 bg-white p-10 text-center text-sm text-forest-600/50">
          No {activeStatus} reviews.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map(r => <AdminReviewCard key={r.id} review={r} />)}
        </div>
      )}
    </>
  )
}

function AdminReviewCard({ review }: { review: Review }) {
  const [loading, setLoading] = useState<'approved' | 'hidden' | 'delete' | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const router = useRouter()
  const badge  = SOURCE_BADGE[review.source] ?? { label: review.source, cls: 'bg-gray-100 text-gray-600' }

  async function run(kind: 'approved' | 'hidden' | 'delete') {
    if (kind === 'delete' && !window.confirm(`Permanently delete ${review.name}'s review? This cannot be undone.`)) return
    setLoading(kind)
    setError(null)
    const result = kind === 'delete' ? await deleteReview(review.id) : await setReviewStatus(review.id, kind)
    setLoading(null)
    if (!result.ok) { setError(result.error); return }
    router.refresh()
  }

  const btn = 'flex items-center gap-1 rounded px-2 py-1 text-xs font-medium disabled:opacity-50'

  return (
    <div className="flex flex-col rounded-xl border border-forest-700/10 bg-white p-5 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="font-semibold text-forest-700">{review.name}</p>
        {review.dog_name && <p className="text-xs text-forest-600">· {review.dog_name}</p>}
        <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.label}</span>
      </div>
      {review.rating ? <Stars rating={review.rating} className="mb-2" /> : <p className="mb-2 text-xs text-forest-600/50">No rating</p>}
      <p className="flex-1 whitespace-pre-line break-words text-sm leading-relaxed text-forest-600">{review.body}</p>
      <p className="mt-3 text-xs text-forest-600/50">
        {new Date(review.created_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>

      <div className="mt-3 flex flex-wrap gap-2 border-t border-forest-700/8 pt-3">
        {review.status !== 'approved' && (
          <button onClick={() => run('approved')} disabled={!!loading} className={`${btn} bg-green-100 text-green-700 hover:bg-green-200`}>
            <Check size={12} /> {loading === 'approved' ? '…' : 'Approve'}
          </button>
        )}
        {review.status !== 'hidden' && (
          <button onClick={() => run('hidden')} disabled={!!loading} className={`${btn} bg-gray-100 text-gray-700 hover:bg-gray-200`}>
            <EyeOff size={12} /> {loading === 'hidden' ? '…' : 'Hide'}
          </button>
        )}
        <button onClick={() => run('delete')} disabled={!!loading} className={`${btn} bg-red-100 text-red-600 hover:bg-red-200`}>
          <Trash2 size={12} /> {loading === 'delete' ? '…' : 'Delete'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function AddReviewForm() {
  const [open,    setOpen]    = useState(false)
  const [name,    setName]    = useState('')
  const [dogName, setDogName] = useState('')
  const [body,    setBody]    = useState('')
  const [rating,  setRating]  = useState<number | null>(null)
  const [source,  setSource]  = useState<'facebook' | 'admin'>('facebook')
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [saved,   setSaved]   = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    const result = await addReview({ name, dogName, body, rating, source })
    setSaving(false)
    if (!result.ok) { setError(result.error); return }
    setName(''); setDogName(''); setBody(''); setRating(null)
    setSaved(true)
    router.refresh()
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        <Plus size={14} /> Add review
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-forest-700/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-forest-700">Add a review</h2>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-forest-600/60 hover:text-forest-700">
          Close
        </button>
      </div>
      <p className="text-xs text-forest-600/70">
        Paste in a review from Facebook, a text or in person. It goes live straight away.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="field">
          <label htmlFor="add-name">Name *</label>
          <input id="add-name" value={name} maxLength={REVIEW_LIMITS.nameMax} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="add-dog">Dog&apos;s name</label>
          <input id="add-dog" value={dogName} maxLength={REVIEW_LIMITS.dogNameMax} onChange={e => setDogName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="add-source">Where it came from</label>
          <select id="add-source" value={source} onChange={e => setSource(e.target.value as 'facebook' | 'admin')}>
            <option value="facebook">Facebook</option>
            <option value="admin">Other (text, email, in person…)</option>
          </select>
        </div>
      </div>

      <div className="field">
        <span className="text-xs font-semibold uppercase tracking-wider text-forest-600">Rating (optional)</span>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="field">
        <label htmlFor="add-body">Review *</label>
        <textarea
          id="add-body"
          rows={4}
          value={body}
          minLength={REVIEW_LIMITS.bodyMin}
          maxLength={REVIEW_LIMITS.bodyMax}
          onChange={e => setBody(e.target.value)}
          required
        />
        <p className="text-right text-xs text-forest-600/50">{body.length}/{REVIEW_LIMITS.bodyMax}</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-700">Review added and live on the site.</p>}

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? <><Loader size={14} className="animate-spin" /> Saving…</> : 'Save review'}
      </button>
    </form>
  )
}
