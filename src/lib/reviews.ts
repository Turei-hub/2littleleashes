// src/lib/reviews.ts
// Customer reviews (public.reviews table). Limits and validation are shared by
// the public form, /api/reviews and the admin "Add review" form. Safe to import
// from client components (uses only the anon client).
//
// Table + RLS were created manually in Supabase — don't create or alter from code.
// The DB enforces char_length(body) between 10 and 1500, rating 1–5 or null.

import { supabase } from '@/lib/supabase'

export type ReviewStatus = 'pending' | 'approved' | 'hidden'
export type ReviewSource = 'website' | 'facebook' | 'admin'

export type Review = {
  id:         string
  name:       string
  dog_name:   string | null
  body:       string
  rating:     number | null
  status:     ReviewStatus
  source:     ReviewSource
  sort_order: number | null
  created_at: string
}

export const REVIEW_STATUSES: ReviewStatus[] = ['pending', 'approved', 'hidden']

export const REVIEW_LIMITS = {
  nameMax:    80,
  dogNameMax: 80,
  bodyMin:    10,
  bodyMax:    1500,
} as const

export type ReviewInput = {
  name:     string
  dog_name: string | null
  body:     string
  rating:   number | null
}

// Validates + normalises untrusted input. Returns the clean row fields or an error message.
export function validateReviewInput(raw: {
  name?: unknown
  dogName?: unknown
  body?: unknown
  rating?: unknown
}): { ok: true; value: ReviewInput } | { ok: false; error: string } {
  const name    = typeof raw.name    === 'string' ? raw.name.trim()    : ''
  const dogName = typeof raw.dogName === 'string' ? raw.dogName.trim() : ''
  const body    = typeof raw.body    === 'string' ? raw.body.trim()    : ''

  if (!name)                                   return { ok: false, error: 'Please enter your name.' }
  if (name.length > REVIEW_LIMITS.nameMax)     return { ok: false, error: `Name must be ${REVIEW_LIMITS.nameMax} characters or less.` }
  if (dogName.length > REVIEW_LIMITS.dogNameMax) return { ok: false, error: `Dog's name must be ${REVIEW_LIMITS.dogNameMax} characters or less.` }
  if (body.length < REVIEW_LIMITS.bodyMin)     return { ok: false, error: `Review must be at least ${REVIEW_LIMITS.bodyMin} characters.` }
  if (body.length > REVIEW_LIMITS.bodyMax)     return { ok: false, error: `Review must be ${REVIEW_LIMITS.bodyMax} characters or less.` }

  let rating: number | null = null
  if (raw.rating !== null && raw.rating !== undefined && raw.rating !== '' && raw.rating !== 0) {
    const r = Number(raw.rating)
    if (!Number.isInteger(r) || r < 1 || r > 5) return { ok: false, error: 'Rating must be between 1 and 5 stars.' }
    rating = r
  }

  return { ok: true, value: { name, dog_name: dogName || null, body, rating } }
}

// Approved reviews, newest first (sort_order as tie-break). Never throws.
// Reads go through Next's fetch cache; admin review actions call
// revalidatePath('/', 'layout') so changes show immediately.
export async function getApprovedReviews(limit?: number): Promise<Review[]> {
  try {
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .order('sort_order', { ascending: true, nullsFirst: false })
    if (limit) query = query.limit(limit)
    const { data, error } = await query
    if (error) throw error
    return (data ?? []) as Review[]
  } catch (err) {
    console.error('getApprovedReviews failed', err)
    return []
  }
}
