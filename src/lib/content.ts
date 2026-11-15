// src/lib/content.ts
// Server-side reader for owner-editable site content (site_content table).
// Any key that's missing, blank, or (for prices) not a number falls back to the
// hardcoded default in content-defaults.ts, so the site never shows blanks.
//
// Reads go through Next's fetch cache; the admin save action calls
// revalidatePath('/', 'layout') to refresh every page after an edit.

import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import { CONTENT_DEFAULTS, CONTENT_FIELDS, type SiteContent } from '@/lib/content-defaults'

const PRICE_KEYS = new Set(CONTENT_FIELDS.filter(c => c.type === 'price').map(c => c.key))

export function isValidPrice(value: string) {
  return /^\d+(\.\d{1,2})?$/.test(value.trim())
}

export const getContent = cache(async (): Promise<SiteContent> => {
  const content: SiteContent = { ...CONTENT_DEFAULTS }

  try {
    const { data, error } = await supabase.from('site_content').select('key, value')
    if (error) throw error

    for (const row of data ?? []) {
      const value = (row.value ?? '').trim()
      if (!(row.key in CONTENT_DEFAULTS) || !value) continue
      if (PRICE_KEYS.has(row.key) && !isValidPrice(value)) continue
      content[row.key] = value
    }
  } catch (err) {
    console.error('getContent: falling back to defaults', err)
  }

  return content
})
