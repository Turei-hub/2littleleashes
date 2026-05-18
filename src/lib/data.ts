// src/lib/data.ts
// Single source of truth for all services, pricing, and policies.
// Edit here and every page/component updates automatically.

import { PawPrint, Droplets, Home, Zap, Handshake, Clock, Car, CalendarDays, MapPin, Camera } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ServiceId = 'dog-walking' | 'dog-wash' | 'home-checkins' | 'endurance-walk'

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
      extraDogLabel: '+$10 per additional dog',
    },
    features: [
      'On-lead walks in varied Rotorua locations — mix it up every time',
      'One-on-one walks to begin with',
      'Gradual introduction to pack walks when your dog is ready',
      'Treats (if allowed), water, and LOTS of pats',
      '100% supervised by Meihana',
      'Free pick-up & drop-off from your street',
    ],
    badge: '🎉 First walk FREE',
    highlight: true,
    specialNote: 'Your first walk is FREE — so your dog can get to know us before joining the fun.',
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
  {
    id: 'endurance-walk',
    icon: Zap,
    title: 'Endurance Walk / Run',
    tagline: 'Epic Sunday missions for high-drive dogs',
    pricing: {
      base: 50,
      baseLabel: '$50 per session',
    },
    schedule: 'Sundays at 8:00 AM',
    duration: '10km+ · Up to 3 Hours',
    features: [
      "All-terrain adventures through Rotorua's forests, lakes, and bush tracks",
      'Operates rain or shine',
      'Rest stops + water breaks included',
      'Ideal for high-energy working breeds',
    ],
    targetBreeds: [
      'Border Collies', 'German Shepherds', 'Huntaways',
      'Malinois', 'Labs', 'Kelpies', 'Pointers', 'Vizslas',
    ],
    badge: '10km · 3hrs · Sundays',
    highlight: false,
    specialNote: null,
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
    icon: MapPin,
    title: 'GPS Every Walk',
    body: 'Every walk is GPS tracked so you always know the route your dog explored.',
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
  { value: 'endurance-run',     label: 'Endurance Run — Sundays ($50)' },
] as const

export const MEET_GREET_OPTIONS = [
  'Mornings (7–10am) work best',
  'Late morning (10am–12pm)',
  'Afternoon (12–2pm)',
  'Flexible — please contact me',
] as const
