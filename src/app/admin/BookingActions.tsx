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
  const [error,   setError]   = useState<string | null>(null)
  const router = useRouter()

  function showError(msg: string) {
    setError(msg)
    setTimeout(() => setError(null), 3500)
  }

  async function updateStatus(status: string) {
    setLoading(status as 'confirmed' | 'cancelled')
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    if (!res.ok) { showError('Failed to update booking status'); return }
    router.refresh()
  }

  async function verifyPayment() {
    setLoading('verify')
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify-payment' }),
    })
    setLoading(null)
    if (!res.ok) { showError('Failed to verify payment'); return }
    router.refresh()
  }

  async function sendEmail(action: 'reminder' | 'review') {
    setLoading(action)
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: action === 'reminder' ? 'send-reminder' : 'request-review' }),
    })
    setLoading(null)
    if (!res.ok) {
      showError(action === 'reminder' ? 'Failed to send reminder' : 'Failed to send review request')
      return
    }
    setSent(action)
    setTimeout(() => setSent(null), 2500)
  }

  const errorMsg = error && (
    <p className="mt-1 text-xs text-red-600">{error}</p>
  )

  if (currentStatus === 'confirmed') {
    return (
      <div>
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
        {errorMsg}
      </div>
    )
  }

  if (currentStatus === 'cancelled') {
    return (
      <div>
        <button
          onClick={() => updateStatus('confirmed')}
          disabled={loading !== null}
          className="rounded px-2 py-1 text-xs text-green-600 hover:bg-green-50 disabled:opacity-50"
        >
          {loading ? '…' : 'Restore'}
        </button>
        {errorMsg}
      </div>
    )
  }

  return (
    <div>
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
      {errorMsg}
    </div>
  )
}
