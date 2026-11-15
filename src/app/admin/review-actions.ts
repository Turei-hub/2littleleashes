'use server'
// src/app/admin/review-actions.ts
// Admin review management. Writes go through the user's session client so the
// reviews RLS policy (public.is_site_admin()) is enforced.

import { revalidatePath } from 'next/cache'
import { createSessionClient } from '@/lib/supabase-server'
import { validateReviewInput, REVIEW_STATUSES, type ReviewStatus } from '@/lib/reviews'

export type ReviewActionResult = { ok: true } | { ok: false; error: string }

const NOT_ALLOWED = "Your account isn't allowed to manage reviews."

async function getAuthedClient() {
  const supabase = createSessionClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session ? supabase : null
}

function done(): ReviewActionResult {
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function setReviewStatus(id: string, status: ReviewStatus): Promise<ReviewActionResult> {
  if (!REVIEW_STATUSES.includes(status)) return { ok: false, error: 'Unknown status.' }
  const supabase = await getAuthedClient()
  if (!supabase) return { ok: false, error: 'Your session has expired — please log in again.' }

  // RLS blocks updates silently (0 rows), so select back to detect it.
  const { data, error } = await supabase.from('reviews').update({ status }).eq('id', id).select('id')
  if (error) {
    console.error('setReviewStatus error:', error)
    return { ok: false, error: 'Could not update the review. Please try again.' }
  }
  if (!data || data.length === 0) return { ok: false, error: NOT_ALLOWED }
  return done()
}

export async function deleteReview(id: string): Promise<ReviewActionResult> {
  const supabase = await getAuthedClient()
  if (!supabase) return { ok: false, error: 'Your session has expired — please log in again.' }

  const { data, error } = await supabase.from('reviews').delete().eq('id', id).select('id')
  if (error) {
    console.error('deleteReview error:', error)
    return { ok: false, error: 'Could not delete the review. Please try again.' }
  }
  if (!data || data.length === 0) return { ok: false, error: NOT_ALLOWED }
  return done()
}

export async function addReview(input: {
  name: string
  dogName: string
  body: string
  rating: number | null
  source: 'facebook' | 'admin'
}): Promise<ReviewActionResult> {
  const supabase = await getAuthedClient()
  if (!supabase) return { ok: false, error: 'Your session has expired — please log in again.' }

  const result = validateReviewInput(input)
  if (!result.ok) return result
  const source = input.source === 'facebook' ? 'facebook' : 'admin'

  const { error } = await supabase.from('reviews').insert({ ...result.value, source, status: 'approved' })
  if (error) {
    console.error('addReview error:', error)
    return {
      ok: false,
      error: error.code === '42501' ? NOT_ALLOWED : 'Could not save the review. Please try again.',
    }
  }
  return done()
}
