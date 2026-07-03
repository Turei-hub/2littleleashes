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
      multiWalk: 25,
      multiWalkLabel: '$25 / walk (2+ per week)',
      extraDog: 15,
      extraDogLabel: '$25 first dog · +$15 each extra dog (2 dogs = $40, 3 dogs = $55, 4 dogs = $70)',
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
      base: 25,
      baseLabel: '$25 per dog',
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
      base: 25,
      baseLabel: '$25 per visit',
      addon: 'Add a walk: $50–$55 total',
    },
    features: [
      'Feeding (owner-provided food) + fresh water refill',
      'Waste clean-up',
      'Medication administration if needed',
      'Quick daily security check around the property',
    ],
    badge: null,
    highlight: false,
    specialNote: 'Add a dog walk to combine care and exercise — $50 or $55 total.',
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

// Booking form — service checkboxes (mirrors the owner's Google Form)
export const BOOKING_SERVICES = [
  { value: 'walk-1x',    label: '$30 - Dog Walk upto 1 hour for 1 WALK A WEEK' },
  { value: 'walk-multi', label: '$25 - Dog Walk for upto 1 hour for 2 OR MORE DAYS OF WEEK' },
  { value: 'extra-dog',  label: '$15 - For extra dog ( If you have 2 or more dogs )' },
  { value: 'dog-wash',   label: '$25 - Dog Wash ( Per Dog ) Pick up - Wash - Drop off' },
  { value: 'checkin',    label: '$25 - Check in Service . Feed, Fresh Water, Clean Waste, Security Check of Property' },
] as const

export const DAYS_PER_WEEK_OPTIONS = ['1', '2', '3', '4', '5', 'Other'] as const
