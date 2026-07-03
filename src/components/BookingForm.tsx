'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, AlertCircle, Loader, Zap } from 'lucide-react'
import { BOOKING_SERVICES, DAYS_PER_WEEK_OPTIONS } from '@/lib/data'

interface FormValues {
  ownerName:      string
  dogInfo:        string
  email:          string
  phone:          string
  services:       string[]
  daysPerWeek:    string
  daysPerWeekOther: string
  notes:          string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function BookingForm() {
  const [status,  setStatus]  = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: { services: [], daysPerWeek: '' },
  })

  const daysPerWeek = watch('daysPerWeek')

  const onSubmit = async (data: FormValues) => {
    setStatus('loading')
    try {
      const services = BOOKING_SERVICES
        .filter(s => data.services.includes(s.value))
        .map(s => s.label)

      const days = data.daysPerWeek === 'Other'
        ? (data.daysPerWeekOther.trim() || 'Other')
        : data.daysPerWeek

      const res  = await fetch('/api/book', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ownerName:   data.ownerName,
          dogInfo:     data.dogInfo,
          email:       data.email,
          phone:       data.phone,
          services,
          daysPerWeek: days,
          notes:       data.notes,
        }),
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
        <p className="text-sm text-forest-600 mb-6">{message}</p>
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 mb-6">
          <strong>What&apos;s next:</strong> Meihana will contact you within 24 hours to confirm your booking.
        </div>
        <button onClick={() => setStatus('idle')} className="btn-outline text-sm">
          Submit another booking
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

      {/* Your details */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-forest-600">
          Your details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="ownerName">First and Last name *</label>
            <input
              id="ownerName"
              placeholder="Sarah Tūhoe"
              {...register('ownerName', { required: 'Name is required' })}
            />
            {errors.ownerName && <p className="text-xs text-red-500">{errors.ownerName.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="dogInfo">Dog/Dogs name and Breed *</label>
            <input
              id="dogInfo"
              placeholder="Buddy, Huntaway"
              {...register('dogInfo', { required: "Dog's name and breed is required" })}
            />
            {errors.dogInfo && <p className="text-xs text-red-500">{errors.dogInfo.message}</p>}
          </div>
          <div className="field">
            <label htmlFor="email">Email *</label>
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
            <label htmlFor="phone">Phone number *</label>
            <input
              id="phone"
              type="tel"
              placeholder="021 123 4567"
              {...register('phone', { required: 'Phone number is required' })}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* Service selection */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-forest-600">
          Service selection * <span className="normal-case font-normal text-forest-600/50">(select all that apply)</span>
        </legend>
        <div className="space-y-2">
          {BOOKING_SERVICES.map(s => (
            <label
              key={s.value}
              htmlFor={`service-${s.value}`}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-forest-700/10 bg-white px-4 py-3 text-sm text-forest-700 transition hover:border-teal-400 hover:bg-teal-50"
            >
              <input
                id={`service-${s.value}`}
                type="checkbox"
                value={s.value}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-forest-700/30 text-teal accent-teal-600"
                {...register('services', { validate: v => v.length > 0 || 'Please select at least one service' })}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
        {errors.services && <p className="mt-1 text-xs text-red-500">{errors.services.message}</p>}
      </fieldset>

      {/* Days per week */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-forest-600">
          How many Days a week? *
        </legend>
        <div className="flex flex-wrap gap-2">
          {DAYS_PER_WEEK_OPTIONS.map(d => (
            <label
              key={d}
              htmlFor={`days-${d}`}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-forest-700/10 bg-white px-4 py-2 text-sm text-forest-700 transition has-[:checked]:border-teal-400 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-800"
            >
              <input
                id={`days-${d}`}
                type="radio"
                value={d}
                className="h-4 w-4 accent-teal-600"
                {...register('daysPerWeek', { required: 'Please select how many days a week' })}
              />
              {d}
            </label>
          ))}
        </div>
        {daysPerWeek === 'Other' && (
          <input
            className="mt-3"
            placeholder="Tell us more"
            {...register('daysPerWeekOther')}
          />
        )}
        {errors.daysPerWeek && <p className="mt-1 text-xs text-red-500">{errors.daysPerWeek.message}</p>}
      </fieldset>

      {/* Notes */}
      <div className="field">
        <label htmlFor="notes">Any other questions or queries you may have?</label>
        <textarea
          id="notes"
          placeholder="e.g. Buddy is nervous around large dogs, gate code is 1234, currently on monthly flea treatment"
          {...register('notes')}
        />
      </div>

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
            <Zap size={10} />
            Instant email
          </span>
          Confirmation sent straight to your inbox
        </p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <><Loader size={14} className="animate-spin" /> Sending…</>
          ) : (
            'Request a walk →'
          )}
        </button>
      </div>
    </form>
  )
}
