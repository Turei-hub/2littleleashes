// src/app/about/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, MapPin, Compass, Car, Pill, Handshake, PawPrint } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About Meihana | 2 Little Leashes Dog Walkers Rotorua',
  description: 'Meet Meihana, the Rotorua-based founder of 2 Little Leashes. Local family business, always supervised, GPS-tracked walks with a photo update every session.',
  alternates: { canonical: 'https://2littleleashes.co.nz/about' },
  openGraph: {
    title: 'About Meihana | 2 Little Leashes Dog Walkers Rotorua',
    description: 'Meet Meihana, the Rotorua-based founder of 2 Little Leashes. Local family business, always supervised, GPS-tracked walks with a photo update every session.',
    url: 'https://2littleleashes.co.nz/about',
    images: [{ url: '/images/meihana-bulldogs-truck.jpg', width: 1200, height: 630, alt: 'Meihana with dogs — 2 Little Leashes Rotorua' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Meihana | 2 Little Leashes Dog Walkers Rotorua',
    description: 'Meet Meihana, the Rotorua-based founder of 2 Little Leashes. Local family business, GPS-tracked walks, photo update every session.',
    images: ['/images/meihana-bulldogs-truck.jpg'],
  },
}

const WHY_US: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Camera,    title: 'Photo after every session',   body: 'We send a photo update after every walk or visit so you can see your dog having the time of their life.' },
  { icon: MapPin,    title: 'GPS-tracked walks',           body: 'Every walk is GPS tracked so you know exactly which Rotorua trails your dog explored.' },
  { icon: Compass,   title: "Rotorua's best locations",    body: 'Forests, lake tracks, bush paths — we mix up locations so walks stay exciting and stimulating.' },
  { icon: Car,       title: 'Free pick-up & drop-off',     body: 'We come to you. Your dog is collected and returned safely from your home.' },
  { icon: Pill,      title: 'Medical care welcome',        body: 'Medication administration and dogs with special needs are welcome — just let us know at booking.' },
  { icon: Handshake, title: 'Meet & greet first',          body: 'Before any walk we visit your home, meet your dog, and understand their needs. No surprises.' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden bg-forest-700 px-4 py-14 sm:px-6 lg:px-8">
        <Image
          src="/images/meihana-bulldogs-truck.jpg"
          alt="Meihana with dogs — 2 Little Leashes Rotorua"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-forest-700/80" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">About us</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white">Meet Meihana</h1>
          <p className="mt-3 text-white text-sm max-w-xl">
            The heart and hands behind every walk, wash, and check-in.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">

        {/* Bio card */}
        <div className="rounded-xl bg-forest-700 p-8 flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
            <Image src="/images/meihana.jpg" alt="Meihana" fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Meihana</h2>
            <p className="text-sm text-mint mb-4">Founder & Lead Walker · 2 Little Leashes Rotorua</p>
            <p className="text-sm text-white/75 leading-relaxed">
              Based in Rotorua, I started 2 Little Leashes to give local dog owners genuine peace of mind. Every walk is personally supervised by me — no subcontractors, no shortcuts. I believe every dog deserves to feel safe, properly exercised, and loved on every walk.
            </p>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">
              Whether it's a solo stroll through the neighbourhood, an epic 10km Sunday mission through Rotorua's forests, or a gentle home check-in while you're at work — I treat every dog like my own.
            </p>
          </div>
        </div>

        {/* Why us */}
        <div>
          <h2 className="font-display text-2xl font-bold text-forest-700 mb-6">Why clients choose us</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map(w => {
              const WIcon = w.icon
              return (
                <div key={w.title} className="rounded-xl bg-forest-50 border border-forest-700/10 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-forest-700">
                    <WIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-forest-700 text-sm">{w.title}</h3>
                  <p className="mt-1 text-xs text-forest-600 leading-relaxed">{w.body}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
            <PawPrint className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-amber-900 mb-2">Ready to meet us?</h2>
          <p className="text-sm text-amber-800 mb-5">Book online and we'll arrange a free meet &amp; greet at your home. First walk is on us.</p>
          <Link href="/book" className="btn-primary px-6 py-3">Book your free first walk →</Link>
        </div>
      </div>

      <Footer />
    </>
  )
}
