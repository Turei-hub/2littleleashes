'use client'

import { useState } from 'react'
import { Loader, Mail, PawPrint, Sparkles } from 'lucide-react'
import BookingForm from '@/components/BookingForm'

type Step = 'email' | 'free' | 'paid'

export default function BookingFlowClient() {
  const [step,     setStep]     = useState<Step>('email')
  const [email,    setEmail]    = useState('')
  const [checking, setChecking] = useState(false)
  const [error,    setError]    = useState('')

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) { setError('Please enter your email address'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError('Enter a valid email address'); return }

    setError('')
    setChecking(true)
    try {
      const res = await fetch('/api/check-customer', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: trimmed }),
      })
      const { isReturning } = await res.json()
      setStep(isReturning ? 'paid' : 'free')
    } catch {
      // Default to paid on failure — safer than giving everyone a free walk
      setStep('paid')
    } finally {
      setChecking(false)
    }
  }

  if (step === 'email') {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-xl border border-forest-700/10 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-forest-700">
              <PawPrint className="h-7 w-7 text-white" />
            </div>
            <h2 className="font-display text-xl font-bold text-forest-700">Let's get you booked</h2>
            <p className="mt-1 text-sm text-forest-600/70">
              Enter your email — we'll check if you're a new or returning customer
            </p>
          </div>

          <form onSubmit={handleContinue} className="space-y-4" noValidate>
            <div className="field">
              <label htmlFor="flow-email">Email address</label>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-forest-600/40" />
                <input
                  id="flow-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  className="pl-9"
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={checking}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checking
                ? <><Loader size={14} className="animate-spin" /> Checking…</>
                : 'Continue →'}
            </button>
          </form>

          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-xs text-amber-800">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-600" />
              <strong>First time?</strong>
            </span>{' '}Your first walk is completely FREE — no payment needed!
          </div>
        </div>
      </div>
    )
  }

  return (
    <BookingForm
      flow={step}
      initialEmail={email}
      onReset={() => { setStep('email'); setEmail('') }}
    />
  )
}
