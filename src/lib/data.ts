// src/lib/data.ts
// Fixed (non-editable) structure for the site. Editable text and prices live in
// the site_content table — see src/lib/content-defaults.ts.

import { Handshake, Clock, Car, CalendarDays, Camera } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SiteContent } from '@/lib/content-defaults'

type Policy = {
  icon: LucideIcon
  title: string
  body: string
}

const POLICY_ICONS: LucideIcon[] = [Handshake, Clock, Car, CalendarDays, Camera]

export function getPolicies(c: SiteContent): Policy[] {
  return POLICY_ICONS.map((icon, i) => {
    const n = i + 1
    const body = c[`policy.${n}.body`]
    return {
      icon,
      title: c[`policy.${n}.title`],
      // Policy 4 is the weekend surcharge — the price comes from the pricing section
      body: n === 4 ? `+$${c['price.weekend_surcharge']} ${body}` : body,
    }
  })
}

export const DAYS_PER_WEEK_OPTIONS = ['1', '2', '3', '4', '5', 'Other'] as const
