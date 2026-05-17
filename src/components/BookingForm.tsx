'use client'
// src/components/BookingForm.tsx

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, AlertCircle, Loader, Upload } from 'lucide-react'
import { SERVICE_OPTIONS, MEET_GREET_OPTIONS } from '@/lib/data'
import { supabase } from '@/lib/supabase'

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

export default function BookingForm() {
  const [status,      setStatus]      = useState<Status>('idle')
  const [message,     setMessage]     = useState('')
  const [paymentFile, setPaymentFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: { service: SERVICE_OPTIONS[0].value, meetGreetPref: MEET_GREET_OPTIONS[0] },
  })

  const watchedOwnerName = watch('ownerName')
  const watchedDogName   = watch('dogName')

  const paymentRef = useMemo(() => {
    if (!watchedDogName || !watchedOwnerName) return null
    const parts = watchedOwnerName.trim().split(/\s+/)
    const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0]
    return `${watchedDogName.toUpperCase()}-${surname.slice(0, 4).toUpperCase()}`
  }, [watchedDogName, watchedOwnerName])

  const onSubmit = async (data: FormValues) => {
    setStatus('loading')
    try {
      // Upload payment screenshot if provided (best-effort)
      let screenshotUrl = ''
      if (paymentFile) {
        const ext  = paymentFile.name.split('.').pop()
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data: uploadData } = await supabase.storage
          .from('payment-screenshots')
          .upload(path, paymentFile, { contentType: paymentFile.type })
        if (uploadData) {
          const { data: urlData } = supabase.storage
            .from('payment-screenshots')
            .getPublicUrl(uploadData.path)
          screenshotUrl = urlData.publicUrl
        }
      }

      const res  = await fetch('/api/book', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...data, screenshotUrl }),
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
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 mb-6">
          <strong>What's next:</strong> Meihana will contact you within 24 hours to arrange your free meet &amp; greet. Remember — your first walk is FREE!
        </div>
        <button onClick={() => setStatus('idle')} className="btn-outline text-sm">
          Submit another booking
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

      {/* Meet & Greet notice */}
      <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <span className="text-xl shrink-0">🤝</span>
        <p className="text-sm text-amber-800">
          <strong>Meet &amp; greet required for new clients.</strong> Once you submit, Meihana will reach out to schedule a free visit at your home before your first walk.
        </p>
      </div>

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
            <label htmlFor="dogName">Dog's name *</label>
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

      {/* Payment section */}
      <div className="space-y-3">
        {/* Bank details info box — shown only when paymentRef is ready */}
        {paymentRef && (
          <div className="rounded-lg border border-teal-300 bg-teal-50 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
              💳 Payment details
            </p>
            <p className="text-sm text-teal-800">
              <span className="font-medium">Bank:</span> 12-3456-7890123-00
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="font-medium">Account:</span> 2 Little Leashes
            </p>
            <p className="mt-2 text-sm text-teal-800">
              Your reference:{' '}
              <span className="inline-block rounded-md bg-teal-100 px-2 py-0.5 font-mono font-bold tracking-widest text-teal-700">
                {paymentRef}
              </span>
            </p>
            <p className="mt-2 text-xs text-teal-600">
              Make your transfer now and upload the screenshot below.
            </p>
          </div>
        )}

        {/* File upload — always visible */}
        <div className="field">
          <label htmlFor="paymentScreenshot" className="flex items-center gap-1.5">
            Payment screenshot
            <span className="text-xs font-normal text-forest-600/50">(optional)</span>
          </label>
          <label
            htmlFor="paymentScreenshot"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-forest-700/20 bg-forest-50/50 px-4 py-3 text-sm text-forest-600/70 hover:border-teal-400 hover:bg-teal-50/40 transition-colors"
          >
            <Upload size={16} className="shrink-0 text-teal-600" />
            {paymentFile
              ? <span className="font-medium text-teal-700">{paymentFile.name}</span>
              : <span>Choose a file…</span>
            }
          </label>
          <input
            id="paymentScreenshot"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="sr-only"
            onChange={e => setPaymentFile(e.target.files?.[0] ?? null)}
          />
        </div>
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
            ⚡ Auto-confirmation
          </span>
          Confirmation email sent instantly to your inbox
        </p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <><Loader size={14} className="animate-spin" /> Sending…</>
          ) : (
            'Send booking request →'
          )}
        </button>
      </div>
    </form>
  )
}
