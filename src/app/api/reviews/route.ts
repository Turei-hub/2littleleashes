// src/app/api/reviews/route.ts
// POST /api/reviews — public "Leave a review" form.
// Saves the review as pending (anon client; RLS only allows status=pending +
// source=website) and emails the owner. Spam protection: honeypot + a basic
// per-IP rate limit.

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateReviewInput } from '@/lib/reviews'
import { sendNewReviewAlert } from '@/lib/email'

export const dynamic = 'force-dynamic'

// Basic in-memory rate limit: per serverless instance, resets on cold start.
// Good enough to stop someone hammering the form; not a hard guarantee.
const RATE_LIMIT_MAX       = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now    = Date.now()
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  // Keep the map from growing forever
  if (hits.size > 5000) {
    hits.forEach((times, key) => {
      if (times.every(t => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(key)
    })
  }
  return false
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Honeypot filled → pretend it worked, save nothing.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ success: true })
    }

    const result = validateReviewInput(body)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

    if (rateLimited(clientIp(req))) {
      return NextResponse.json(
        { error: "You've sent a few reviews already — please try again a bit later." },
        { status: 429 },
      )
    }

    const review = result.value

    // No .select(): anon can't read pending rows, so returning them would fail RLS.
    const { error: dbError } = await supabase.from('reviews').insert({
      ...review,
      status: 'pending',
      source: 'website',
    })
    if (dbError) {
      console.error('Review insert error:', dbError)
      return NextResponse.json({ error: 'Could not save your review. Please try again.' }, { status: 500 })
    }

    // Best-effort — the review is already saved.
    try {
      await sendNewReviewAlert({
        name:    review.name,
        dogName: review.dog_name,
        rating:  review.rating,
        body:    review.body,
      })
    } catch (emailError) {
      console.error('Review alert email error (review saved):', emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reviews API error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
