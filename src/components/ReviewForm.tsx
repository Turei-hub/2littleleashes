'use client'
// src/components/ReviewForm.tsx
// Public "Leave a review" form. Posts to /api/reviews, which saves it as pending.

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { REVIEW_LIMITS } from '@/lib/reviews'

interface FormValues {
  name:    string
  dogName: string
  body:    string
  website: string // honeypot — real people never see or fill this
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export const REVIEW_THANKS = 'Thanks! Your review will appear once Meihana has had a look.'

export function StarPicker({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value ?? 0
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(null)}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          aria-pressed={value === n}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(value === n ? null : n)}
          className={`text-3xl leading-none transition ${n <= shown ? 'text-amber-400' : 'text-forest-700/15'} hover:scale-110`}
        >
          ★
        </button>
      ))}
      {value && (
        <button type="button" onClick={() => onChange(null)} className="ml-2 text-xs text-forest-600/60 underline hover:text-forest-700">
          clear
        </button>
      )}
    </div>
  )
}

export default function ReviewForm() {
  const [status,  setStatus]  = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [rating,  setRating]  = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({ defaultValues: { name: '', dogName: '', body: '', website: '' } })

  const bodyLength = watch('body')?.length ?? 0

  const onSubmit = async (data: FormValues) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/reviews', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...data, rating }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.')
      setStatus('success')
      reset()
      setRating(null)
    } catch (err: unknown) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-forest-700/10 bg-white p-8 text-center shadow-sm">
        <CheckCircle className="mx-auto mb-4 text-forest-500" size={48} />
        <p className="text-sm text-forest-700">{REVIEW_THANKS}</p>
        <button onClick={() => setStatus('idle')} className="btn-outline mt-6 text-sm">
          Leave another review
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-xl border border-forest-700/10 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="review-name">Your name *</label>
          <input
            id="review-name"
            placeholder="Sarah Tūhoe"
            maxLength={REVIEW_LIMITS.nameMax}
            {...register('name', {
              required:  'Please enter your name',
              validate:  v => v.trim().length > 0 || 'Please enter your name',
              maxLength: { value: REVIEW_LIMITS.nameMax, message: `${REVIEW_LIMITS.nameMax} characters max` },
            })}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="field">
          <label htmlFor="review-dog">Dog&apos;s name <span className="normal-case font-normal text-forest-600/50">(optional)</span></label>
          <input
            id="review-dog"
            placeholder="Buddy"
            maxLength={REVIEW_LIMITS.dogNameMax}
            {...register('dogName', { maxLength: { value: REVIEW_LIMITS.dogNameMax, message: `${REVIEW_LIMITS.dogNameMax} characters max` } })}
          />
          {errors.dogName && <p className="text-xs text-red-500">{errors.dogName.message}</p>}
        </div>
      </div>

      <div className="field">
        <span className="text-xs font-semibold uppercase tracking-wider text-forest-600">
          Rating <span className="normal-case font-normal text-forest-600/50">(optional)</span>
        </span>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="field">
        <label htmlFor="review-body">Your review *</label>
        <textarea
          id="review-body"
          rows={5}
          maxLength={REVIEW_LIMITS.bodyMax}
          placeholder="How did your dog find their walks?"
          {...register('body', {
            validate: v => {
              const len = v.trim().length
              if (len < REVIEW_LIMITS.bodyMin) return `Please write at least ${REVIEW_LIMITS.bodyMin} characters`
              if (len > REVIEW_LIMITS.bodyMax) return `${REVIEW_LIMITS.bodyMax} characters max`
              return true
            },
          })}
        />
        <div className="flex justify-between gap-2">
          {errors.body ? <p className="text-xs text-red-500">{errors.body.message}</p> : <span />}
          <p className="text-xs text-forest-600/50">{bodyLength}/{REVIEW_LIMITS.bodyMax}</p>
        </div>
      </div>

      {/* Honeypot — hidden from people and screen readers, bots tend to fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="review-website">Website</label>
        <input id="review-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'loading' ? <><Loader size={14} className="animate-spin" /> Sending…</> : 'Submit review'}
      </button>
    </form>
  )
}
