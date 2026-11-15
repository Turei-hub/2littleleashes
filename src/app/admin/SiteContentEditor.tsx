'use client'
// src/app/admin/SiteContentEditor.tsx
// "Site Content" tab: one card per section, one Save button per section.

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { CheckCircle, ImagePlus, Loader } from 'lucide-react'
import type { ContentField } from '@/lib/content-defaults'
import { saveContentSection } from './content-actions'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export default function SiteContentEditor({ fields }: { fields: ContentField[] }) {
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  // Group by section, keeping first-seen order
  const sections: { name: string; fields: ContentField[] }[] = []
  for (const field of fields) {
    const group = sections.find(s => s.name === field.section)
    if (group) group.fields.push(field)
    else sections.push({ name: field.section, fields: [field] })
  }

  return (
    <>
      <p className="mb-6 text-sm text-forest-600/70">
        Edit the text, prices and photos shown on the public site. Changes go live as soon as you save.
      </p>

      <div className="space-y-6">
        {sections.map(s => (
          <SectionForm key={s.name} name={s.name} fields={s.fields} onSaved={() => setToast(`${s.name} saved`)} />
        ))}
      </div>

      {toast && (
        <div className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-forest-700 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          <CheckCircle size={16} className="text-teal-300" />
          {toast}
        </div>
      )}
    </>
  )
}

function SectionForm({ name, fields, onSaved }: { name: string; fields: ContentField[]; onSaved: () => void }) {
  const initial = Object.fromEntries(fields.map(f => [f.key, f.value]))
  const [saved,  setSaved]  = useState<Record<string, string>>(initial)
  const [values, setValues] = useState<Record<string, string>>(initial)
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const router = useRouter()

  const dirtyKeys = fields.map(f => f.key).filter(k => values[k] !== saved[k])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (dirtyKeys.length === 0) return
    setSaving(true)
    setError('')
    const changes = Object.fromEntries(dirtyKeys.map(k => [k, values[k]]))
    const result = await saveContentSection(name, changes)
    setSaving(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setSaved(values)
    onSaved()
    router.refresh()
  }

  return (
    <form onSubmit={handleSave} className="rounded-xl border border-forest-700/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-forest-700">{name}</h2>
        {dirtyKeys.length > 0 && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(f => (
          <FieldInput
            key={f.key}
            field={f}
            value={values[f.key]}
            onChange={v => setValues(prev => ({ ...prev, [f.key]: v }))}
            onError={setError}
          />
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={saving || dirtyKeys.length === 0}
          className="flex items-center gap-1.5 rounded-lg bg-forest-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <><Loader size={14} className="animate-spin" /> Saving…</> : `Save ${name}`}
        </button>
      </div>
    </form>
  )
}

function FieldInput({
  field, value, onChange, onError,
}: {
  field: ContentField
  value: string
  onChange: (v: string) => void
  onError: (msg: string) => void
}) {
  const id = `content-${field.key}`
  const inputClass = 'w-full rounded-lg border border-forest-700/15 bg-white px-3 py-2 text-sm text-forest-700 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400'
  const wide = field.type === 'textarea' || field.type === 'image'

  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-forest-600">{field.label}</label>

      {field.type === 'text' && (
        <input id={id} type="text" value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
      )}

      {field.type === 'textarea' && (
        <textarea id={id} rows={3} value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
      )}

      {field.type === 'price' && (
        <div className="relative max-w-[10rem]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-forest-600/60">$</span>
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`${inputClass} pl-6`}
          />
        </div>
      )}

      {field.type === 'image' && (
        <ImageInput id={id} fieldKey={field.key} value={value} onChange={onChange} onError={onError} />
      )}
    </div>
  )
}

function ImageInput({
  id, fieldKey, value, onChange, onError,
}: {
  id: string
  fieldKey: string
  value: string
  onChange: (v: string) => void
  onError: (msg: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return onError('File must be an image.')
    if (file.size > MAX_IMAGE_BYTES)     return onError('Photo must be under 5 MB.')

    setUploading(true)
    onError('')
    const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${fieldKey.replace(/\./g, '-')}/${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('site-images')
      .upload(path, file, { contentType: file.type, upsert: false })
    setUploading(false)

    if (error) {
      console.error('site-images upload error:', error)
      return onError('Upload failed. Please try again.')
    }
    const { data: { publicUrl } } = supabase.storage.from('site-images').getPublicUrl(path)
    onChange(publicUrl)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-forest-700/10 bg-forest-50 sm:w-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="" className="h-full w-full object-cover" />
      </div>
      <div>
        <input id={id} ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-forest-700/20 px-3 py-1.5 text-sm font-medium text-forest-700 transition hover:bg-forest-50 disabled:opacity-50"
        >
          {uploading ? <><Loader size={14} className="animate-spin" /> Uploading…</> : <><ImagePlus size={15} /> Replace photo</>}
        </button>
        <p className="mt-1.5 text-xs text-forest-600/60">JPG or PNG, under 5 MB. Click Save to publish.</p>
      </div>
    </div>
  )
}
