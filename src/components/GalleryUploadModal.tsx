'use client'

import { useState, useRef } from 'react'
import { X, Upload, CheckCircle, ImagePlus } from 'lucide-react'

export default function GalleryUploadModal({ onClose }: { onClose: () => void }) {
  const [dogName,  setDogName]  = useState('')
  const [caption,  setCaption]  = useState('')
  const [file,     setFile]     = useState<File | null>(null)
  const [preview,  setPreview]  = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File) {
    if (!f.type.startsWith('image/')) { setError('Please select an image file.'); return }
    if (f.size > 5 * 1024 * 1024)    { setError('Photo must be under 5 MB.');     return }
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dogName.trim()) { setError("Dog's name is required."); return }
    if (!file)           { setError('Please select a photo.');  return }

    setLoading(true)
    setError('')

    const fd = new FormData()
    fd.append('dog_name', dogName.trim())
    fd.append('caption',  caption.trim())
    fd.append('image',    file)

    const res  = await fetch('/api/gallery/submit', { method: 'POST', body: fd })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
    setSuccess(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-forest-700">Share your photo</h2>
            <p className="mt-0.5 text-xs text-forest-600">Photos are reviewed before appearing in the gallery.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-forest-600 transition hover:bg-forest-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle className="mb-3 h-12 w-12 text-forest-500" />
            <p className="font-semibold text-forest-700">Photo submitted!</p>
            <p className="mt-1 text-sm text-forest-600">
              Thanks for sharing — we&apos;ll review it shortly.
            </p>
            <button onClick={onClose} className="btn-primary mt-6">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dog name */}
            <div className="field">
              <label>
                Dog&apos;s name <span className="text-red-500 normal-case font-normal">*</span>
              </label>
              <input
                type="text"
                value={dogName}
                onChange={e => setDogName(e.target.value)}
                placeholder="e.g. Buddy"
                required
              />
            </div>

            {/* Caption */}
            <div className="field">
              <label>
                Caption{' '}
                <span className="normal-case font-normal text-forest-600/50">(optional)</span>
              </label>
              <input
                type="text"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="e.g. Loving the Redwoods!"
              />
            </div>

            {/* Photo upload */}
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-forest-600">
                Photo <span className="text-red-500 normal-case font-normal">*</span>
              </p>
              <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-forest-700/20 bg-forest-50 px-4 py-6 transition hover:border-forest-700/40"
                onClick={() => inputRef.current?.click()}
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
                ) : (
                  <>
                    <ImagePlus className="mb-2 h-8 w-8 text-forest-600/40" />
                    <p className="text-sm text-forest-600">Click to choose a photo</p>
                    <p className="mt-0.5 text-xs text-forest-600/60">JPG, PNG or WEBP · max 5 MB</p>
                  </>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
                />
              </div>
              {file && (
                <p className="mt-1 truncate text-xs text-forest-600/60">{file.name}</p>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              <Upload size={14} />
              {loading ? 'Uploading…' : 'Submit photo'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
