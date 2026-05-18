'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type LoadingState = 'confirmed' | 'cancelled' | 'verify' | 'reminder' | 'review' | null
type SentState    = 'reminder' | 'review' | null

export default function BookingActions({
  id,
  currentStatus,
  paymentStatus,
  screenshotUrl,
}: {
  id: string
  currentStatus: string
  paymentStatus: string
  screenshotUrl: string | null
}) {
  const [loading, setLoading] = useState<LoadingState>(null)
  const [sent,    setSent]    = useState<SentState>(null)
  const router = useRouter()

  async function updateStatus(status: string) {
    setLoading(status as 'confirmed' | 'cancelled')
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    router.refresh()
  }

  async function verifyPayment() {
    setLoading('verify')
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify-payment' }),
    })
    setLoading(null)
    router.refresh()
  }

  async function sendEmail(action: 'reminder' | 'review') {
    setLoading(action)
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: action === 'reminder' ? 'send-reminder' : 'request-review' }),
    })
    setLoading(null)
    setSent(action)
    setTimeout(() => setSent(null), 2500)
  }

  if (currentStatus === 'confirmed') {
    return (
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => sendEmail('reminder')}
          disabled={loading !== null}
          className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200 disabled:opacity-50"
        >
          {loading === 'reminder' ? '…' : sent === 'reminder' ? 'Sent ✓' : 'Send Reminder'}
        </button>
        <button
          onClick={() => sendEmail('review')}
          disabled={loading !== null}
          className="rounded bg-forest-100 px-2 py-1 text-xs font-medium text-forest-700 hover:bg-forest-200 disabled:opacity-50"
        >
          {loading === 'review' ? '…' : sent === 'review' ? 'Sent ✓' : 'Request Review'}
        </button>
        <button
          onClick={() => updateStatus('cancelled')}
          disabled={loading !== null}
          className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {loading === 'cancelled' ? '…' : 'Cancel'}
        </button>
      </div>
    )
  }

  if (currentStatus === 'cancelled') {
    return (
      <button
        onClick={() => updateStatus('confirmed')}
        disabled={loading !== null}
        className="rounded px-2 py-1 text-xs text-green-600 hover:bg-green-50 disabled:opacity-50"
      >
        {loading ? '…' : 'Restore'}
      </button>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      {paymentStatus === 'uploaded' && (
        <button
          onClick={verifyPayment}
          disabled={loading !== null}
          className="rounded bg-teal-100 px-2 py-1 text-xs font-medium text-teal-700 hover:bg-teal-200 disabled:opacity-50"
        >
          {loading === 'verify' ? '…' : 'Verify Payment'}
        </button>
      )}
      <button
        onClick={() => updateStatus('confirmed')}
        disabled={loading !== null}
        className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200 disabled:opacity-50"
      >
        {loading === 'confirmed' ? '…' : 'Confirm'}
      </button>
      <button
        onClick={() => updateStatus('cancelled')}
        disabled={loading !== null}
        className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
      >
        {loading === 'cancelled' ? '…' : 'Cancel'}
      </button>
    </div>
  )
}
