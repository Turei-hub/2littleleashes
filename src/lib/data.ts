// src/lib/data.ts
// Single source of truth for all services, pricing, and policies.
// Edit here and every page/component updates automatically.

import { PawPrint, Droplets, Home, Handshake, Clock, Car, CalendarDays, Camera } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ServiceId = 'dog-walking' | 'dog-wash' | 'home-checkins'

type ServicePricing = {
  base: number
  baseLabel: string
  multiWalk?: number
  multiWalkLabel?: string
  extraDog?: number
  extraDogLabel?: string
  addon?: string
}

type Service = {
  id: ServiceId
  icon: LucideIcon
  title: string
  tagline: string
  pricing: ServicePricing
  features: readonly string[]
  badge: string | null
  highlight: boolean
  specialNote: string | null
  schedule?: string
  duration?: string
  targetBreeds?: readonly string[]
}

type Policy = {
  icon: LucideIcon
  title: string
  body: string
}

export const SERVICES: Service[] = [
  {
    id: 'dog-walking',
    icon: PawPrint,
    title: 'Dog Walking',
    tagline: 'On-lead adventures across Rotorua',
    pricing: {
      base: 30,
      baseLabel: '$30 / walk (1x per week)',
      multiWalk: 20,
      multiWalkLabel: '$20 / walk (2+ per week)',
      extraDog: 10,
      extraDogLabel: '$20 first dog · +$10 each extra dog (2 dogs = $30, 3 dogs = $40, 4 dogs = $50)',
    },
    features: [
      'On-lead walks in varied Rotorua locations — mix it up every time',
      'One-on-one walks to begin with',
      'Gradual introduction to pack walks when your dog is ready',
      'Treats (if allowed), water, and LOTS of pats',
      '100% supervised by Meihana',
      'Free pick-up & drop-off from your street',
    ],
    badge: null,
    highlight: true,
    specialNote: null,
  },
  {
    id: 'dog-wash',
    icon: Droplets,
    title: 'Dog Wash',
    tagline: 'Professional wash at a local pet store',
    pricing: {
      base: 20,
      baseLabel: '$20 flat rate',
    },
    features: [
      'Taken to a local Rotorua pet care store for a full professional wash',
      'Gentle, dog-friendly shampoo',
      'Towel dry + blow dry included',
      'Keeps your dog clean, fresh, and coat-healthy',
      'Free pick-up & drop-off',
    ],
    badge: null,
    highlight: false,
    specialNote: null,
  },
  {
    id: 'home-checkins',
    icon: Home,
    title: 'Home Check-Ins',
    tagline: "Care and security while you're away",
    pricing: {
      base: 20,
      baseLabel: '$20 per visit',
      addon: 'Add a walk: $40–$50 total',
    },
    features: [
      'Feeding (owner-provided food) + fresh water refill',
      'Waste clean-up',
      'Medication administration if needed',
      'Quick daily security check around the property',
    ],
    badge: null,
    highlight: false,
    specialNote: 'Add a dog walk to combine care and exercise — $40 or $50 total.',
  },
]

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

// Booking form options
export const SERVICE_OPTIONS = [
  { value: 'dog-walking-1x',    label: 'Dog Walk — 1x per week ($30/walk)' },
  { value: 'dog-walking-multi', label: 'Dog Walk — 2+ per week ($20/walk)' },
  { value: 'dog-wash',          label: 'Dog Wash ($20 flat)' },
  { value: 'home-checkin',      label: 'Home Check-In ($20/visit)' },
  { value: 'checkin-walk',      label: 'Home Check-In + Walk ($40–$50)' },
] as const

export const MEET_GREET_OPTIONS = [
  'Mornings (7–10am) work best',
  'Late morning (10am–12pm)',
  'Afternoon (12–2pm)',
  'Flexible — please contact me',
] as const
