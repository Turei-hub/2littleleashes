'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BookingActions({
  id,
  currentStatus,
}: {
  id: string
  currentStatus: string
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function updateStatus(status: string) {
    setLoading(status)
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setLoading(null)
    router.refresh()
  }

  if (currentStatus === 'confirmed') {
    return (
      <button
        onClick={() => updateStatus('cancelled')}
        disabled={loading !== null}
        className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {loading ? '…' : 'Cancel'}
      </button>
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
    <div className="flex gap-1">
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
