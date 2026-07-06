// src/lib/data.ts
// Single source of truth for all services, pricing, and policies.
// Edit here and every page/component updates automatically.

import { Handshake, Clock, Car, CalendarDays, Camera } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Policy = {
  icon: LucideIcon
  title: string
  body: string
}

export const POLICIES: Policy[] = [
  {
    icon: Handshake,
    title: 'Meet & Greet First',
    body: 'Mandatory for all new clients. We come to you, meet your dog, go over personality, habits, and any medical instructions.',
  },
  {
    icon: Clock,
    title: 'Operating Hours (Winter)',
    body: '7:00 AM – 2:00 PM during daylight savings.',
  },
  {
    icon: Car,
    title: 'Free Pick-up & Drop-off',
    body: 'Included with all walks and washes. Safe transport, personally supervised by Meihana.',
  },
  {
    icon: CalendarDays,
    title: 'Weekend Surcharge',
    body: '+$20 flat per walk on Saturdays and Sundays.',
  },
  {
    icon: Camera,
    title: 'Photo Updates',
    body: 'A photo sent after every session — your dog having the time of their life.',
  },
]

// Booking form — service checkboxes (mirrors the owner's Google Form)
export const BOOKING_SERVICES = [
  { value: 'walk-1x',    label: '$30 - Dog Walk upto 1 hour for 1 WALK A WEEK' },
  { value: 'walk-multi', label: '$25 - Dog Walk for upto 1 hour for 2 OR MORE DAYS OF WEEK' },
  { value: 'extra-dog',  label: '$15 - For extra dog ( If you have 2 or more dogs )' },
  { value: 'dog-wash',   label: '$25 - Dog Wash ( Per Dog ) Pick up - Wash - Drop off' },
  { value: 'checkin',    label: '$25 - Check in Service . Feed, Fresh Water, Clean Waste, Security Check of Property' },
] as const

export const DAYS_PER_WEEK_OPTIONS = ['1', '2', '3', '4', '5', 'Other'] as const
