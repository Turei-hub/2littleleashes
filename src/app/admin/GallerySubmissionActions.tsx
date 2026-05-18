'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Trash2 } from 'lucide-react'

export default function GallerySubmissionActions({
  id,
  showApproveReject = true,
}: {
  id: string
  showApproveReject?: boolean
}) {
  const [loading, setLoading] = useState<'approve' | 'reject' | 'delete' | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const router = useRouter()

  function showError(msg: string) {
    setError(msg)
    setTimeout(() => setError(null), 3500)
  }

  async function act(action: 'approve' | 'reject') {
    setLoading(action)
    const res = await fetch(`/api/gallery/approve/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    setLoading(null)
    if (!res.ok) { showError(`Failed to ${action} photo`); return }
    router.refresh()
  }

  async function del() {
    if (!window.confirm('Permanently delete this photo? This cannot be undone.')) return
    setLoading('delete')
    const res = await fetch(`/api/gallery/delete/${id}`, { method: 'DELETE' })
    setLoading(null)
    if (!res.ok) { showError('Failed to delete photo'); return }
    router.refresh()
  }

  return (
    <div>
      <div className="flex gap-2">
        {showApproveReject && (
          <>
            <button
              onClick={() => act('approve')}
              disabled={!!loading}
              className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-200 disabled:opacity-50"
            >
              <Check size={12} />
              {loading === 'approve' ? '…' : 'Approve'}
            </button>
            <button
              onClick={() => act('reject')}
              disabled={!!loading}
              className="flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200 disabled:opacity-50"
            >
              <X size={12} />
              {loading === 'reject' ? '…' : 'Reject'}
            </button>
          </>
        )}
        <button
          onClick={del}
          disabled={!!loading}
          className="flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-200 disabled:opacity-50"
        >
          <Trash2 size={12} />
          {loading === 'delete' ? '…' : 'Delete'}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
