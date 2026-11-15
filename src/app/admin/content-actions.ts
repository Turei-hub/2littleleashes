'use server'
// src/app/admin/content-actions.ts
// Saves one section of the Site Content editor. Writes go through the user's
// session client so the site_content RLS policy (is_site_admin) is enforced.

import { revalidatePath } from 'next/cache'
import { createSessionClient } from '@/lib/supabase-server'
import { CONTENT_FIELDS } from '@/lib/content-defaults'
import { isValidPrice } from '@/lib/content'

export type SaveResult = { ok: true } | { ok: false; error: string }

export async function saveContentSection(
  section: string,
  values: Record<string, string>,
): Promise<SaveResult> {
  const supabase = createSessionClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { ok: false, error: 'Your session has expired — please log in again.' }

  const now = new Date().toISOString()
  const rows = []

  for (const [key, raw] of Object.entries(values)) {
    const index = CONTENT_FIELDS.findIndex(c => c.key === key)
    const field = CONTENT_FIELDS[index]
    if (!field || field.section !== section) return { ok: false, error: `Unknown field: ${key}` }

    const value = raw.trim()
    if (!value) return { ok: false, error: `"${field.label}" can't be empty.` }
    if (field.type === 'price' && !isValidPrice(value)) {
      return { ok: false, error: `"${field.label}" must be a number, e.g. 25 or 25.50.` }
    }
    if (field.type === 'image' && !/^(https:\/\/|\/images\/)/.test(value)) {
      return { ok: false, error: `"${field.label}" isn't a valid image.` }
    }

    rows.push({
      key,
      value,
      label:      field.label,
      type:       field.type,
      section:    field.section,
      sort_order: (index + 1) * 10, // matches supabase/seed_site_content.sql
      updated_at: now,
    })
  }

  if (rows.length === 0) return { ok: true }

  const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' })
  if (error) {
    console.error('saveContentSection error:', error)
    return {
      ok: false,
      error: error.code === '42501'
        ? "Your account isn't allowed to edit site content."
        : 'Could not save changes. Please try again.',
    }
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}
