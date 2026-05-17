'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { SERVICE_OPTIONS, MEET_GREET_OPTIONS } from '@/lib/data'

interface FormValues {
  ownerName:    string
  email:        string
  phone:        string
  suburb:       string
  dogName:      string
  breed:        string
  service:      string
  preferredDate:string
  meetGreetPref:string
  notes:        string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const PRICING_SUMMARY = [
  { label: 'Dog Walk (1x/week)',  price: '$30 / walk' },
  { label: 'Dog Walk (2+/week)',  price: '$20 / walk' },
  { label: 'Dog Wash',            price: '$20 flat' },
  { label: 'Home Check-In',       price: '$20 / visit' },
  { label: 'Check-In + Walk',     price: '$40–50' },
  { label: 'Endurance Run',       price: '$50' },
]

function buildRef(dogName: string, ownerName: string) {
  const parts   = ownerName.trim().split(/\s+/)
  const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0]
  return `${dogName.toUpperCase()}-${surname.slice(0, 4).toUpperCase()}`
}

export default function BookingForm({
  flow,
  initialEmail,
  onReset,
}: {
  flow: 'free' | 'paid'
  initialEmail: string
  onReset: () => void
}) {
  const [status,  setStatus]  = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      email:        initialEmail,
      service:      SERVICE_OPTIONS[0].value,
      meetGreetPref: MEET_GREET_OPTIONS[0],
    },
  })

  const watchedOwnerName = watch('ownerName')
  const watchedDogName   = watch('dogName')

  const paymentRef = useMemo(() => {
    if (flow !== 'paid') return null
    if (!watchedDogName?.trim() || !watchedOwnerName?.trim()) return null
    return buildRef(watchedDogName, watchedOwnerName)
  }, [flow, watchedDogName, watchedOwnerName])

  const onSubmit = async (data: FormValues) => {
    setStatus('loading')
    try {
      const res  = await fetch('/api/book', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...data, bookingType: flow }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Unknown error')
      setStatus('success')
      setMessage(json.message)
      reset()
    } catch (err: unknown) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-forest-700/10 bg-white p-8 text-center shadow-sm">
        <CheckCircle className="mx-auto mb-4 text-forest-500" size={48} />
        <h3 className="font-display text-xl font-semibold text-forest-700 mb-2">Booking received! 🎉</h3>
        <p className="text-sm text-forest-600 mb-4">{message}</p>
        {flow === 'free' ? (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 mb-6">
            <strong>What&apos;s next:</strong> Meihana will contact you within 24 hours to arrange your free meet &amp; greet. Remember — your first walk is FREE!
          </div>
        ) : (
          <div className="rounded-lg bg-teal-50 border border-teal-200 p-4 text-sm text-teal-800 mb-6">
            <strong>Check your inbox</strong> — we&apos;ve sent your payment details and bank reference. Meihana will confirm once payment is received.
          </div>
        )}
        <button onClick={onReset} className="btn-outline text-sm">
          Submit another booking
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

      {/* Flow header */}
      {flow === 'free' ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">🎉</span>
            <div>
              <p className="font-semibold text-amber-900">Your first walk is FREE</p>
              <p className="mt-0.5 text-sm text-amber-800">
                New customer booking · {initialEmail}
              </p>
            </div>
            <button
              type="button"
              onClick={onReset}
              className="ml-auto shrink-0 text-xs text-amber-700 underline hover:text-amber-900"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-teal-900">👋 Welcome back!</p>
                <p className="mt-0.5 text-sm text-teal-800">Returning customer · {initialEmail}</p>
              </div>
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-teal-700 underline hover:text-teal-900"
              >
                Change
              </button>
            </div>
          </div>

          {/* Pricing grid */}
          <div className="rounded-xl border border-forest-700/10 bg-forest-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-forest-600/60">Pricing</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PRICING_SUMMARY.map(p => (
                <div key={p.label} className="rounded-lg border border-forest-700/8 bg-white px-3 py-2">
                  <p className="text-xs text-forest-600/70">{p.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-forest-700">{p.price}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-forest-600/50">+$20 weekend surcharge · +$10 per extra dog</p>
          </div>
        </div>
      )}

      {/* Meet & Greet notice — free flow only */}
      {flow === 'free' && (
        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <span className="text-xl shrink-0">🤝</span>
          <p className="text-sm text-amber-800">
            <strong>Meet &amp; greet required for new clients.</strong> Once you submit, Meihana will reach out to schedule a free visit at your home before your first walk.
          </p>
        </div>
      )}

      {/* Owner details */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-forest-600">
          Your details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="ownerName">Full name *</label>
            <input
              id="ownerName"
              placeholder="Sarah Tūhoe"
              {...register('ownerName', { required: 'Name is required' })}
            />
            {errors.ownerName && <p className="text-xs text-red-500">{errors.ownerName.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="email">Email address *</label>
            <input
              id="email"
              type="email"
              placeholder="sarah@email.com"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              })}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="phone">Phone number</label>
            <input id="phone" type="tel" placeholder="021 000 0000" {...register('phone')} />
          </div>
          <div className="field">
            <label htmlFor="suburb">Suburb / area</label>
            <input id="suburb" placeholder="Ngongotahā, Rotorua" {...register('suburb')} />
          </div>
        </div>
      </fieldset>

      {/* Dog details */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-forest-600">
          About your dog
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="dogName">Dog&apos;s name *</label>
            <input
              id="dogName"
              placeholder="Buddy"
              {...register('dogName', { required: "Dog's name is required" })}
            />
            {errors.dogName && <p className="text-xs text-red-500">{errors.dogName.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="breed">Breed &amp; age</label>
            <input id="breed" placeholder="Huntaway, 2 years" {...register('breed')} />
          </div>
        </div>
      </fieldset>

      {/* Booking details */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-forest-600">
          Booking details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="service">Service *</label>
            <select id="service" {...register('service', { required: 'Please select a service' })}>
              {SERVICE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.label}>{opt.label}</option>
              ))}
            </select>
            {errors.service && <p className="text-xs text-red-500">{errors.service.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="preferredDate">Preferred start date</label>
            <input id="preferredDate" type="date" {...register('preferredDate')} />
          </div>
          <div className="field sm:col-span-2">
            <label htmlFor="meetGreetPref">Meet &amp; greet preference *</label>
            <select
              id="meetGreetPref"
              {...register('meetGreetPref', { required: 'Please select a preference' })}
            >
              {MEET_GREET_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            {errors.meetGreetPref && <p className="text-xs text-red-500">{errors.meetGreetPref.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* Notes */}
      <div className="field">
        <label htmlFor="notes">Notes (vet info, gate code, medical needs, special instructions)</label>
        <textarea
          id="notes"
          placeholder="e.g. Buddy is nervous around large dogs, gate code is 1234, currently on monthly flea treatment"
          {...register('notes')}
        />
      </div>

      {/* Payment reference — paid flow only, shown when ref is computable */}
      {flow === 'paid' && paymentRef && (
        <div className="rounded-lg border border-teal-300 bg-teal-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-700">
            💳 Your payment details
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-teal-700">Bank account</span>
              <span className="font-semibold text-teal-900">12-3456-7890123-00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-teal-700">Account name</span>
              <span className="font-semibold text-teal-900">2 Little Leashes</span>
            </div>
            <div className="flex justify-between items-center border-t border-teal-200 pt-2 mt-2">
              <span className="text-teal-700">Your reference</span>
              <span className="rounded-md bg-teal-100 px-2.5 py-1 font-mono font-bold tracking-widest text-teal-800">
                {paymentRef}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-teal-600">
            These details will also be in your confirmation email. Reply to that email with your transfer screenshot.
          </p>
        </div>
      )}

      {/* Error banner */}
      {status === 'error' && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {message}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="flex items-center gap-2 text-xs text-forest-600/60">
          <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-semibold text-forest-700">
            ⚡ Instant email
          </span>
          {flow === 'free' ? 'Confirmation sent straight to your inbox' : 'Payment details sent to your inbox'}
        </p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <><Loader size={14} className="animate-spin" /> Sending…</>
          ) : flow === 'free' ? (
            'Request free walk →'
          ) : (
            'Send booking request →'
          )}
        </button>
      </div>
    </form>
  )
}
