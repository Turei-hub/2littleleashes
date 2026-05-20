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
  description: 'Meet Meihana, the Rotorua-based founder of 2 Little Leashes. Local family business, always supervised, with a photo update every session.',
  alternates: { canonical: 'https://www.2littleleashes.co.nz/about' },
  openGraph: {
    title: 'About Meihana | 2 Little Leashes Dog Walkers Rotorua',
    description: 'Meet Meihana, the Rotorua-based founder of 2 Little Leashes. Local family business, always supervised, with a photo update every session.',
    url: 'https://www.2littleleashes.co.nz/about',
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/meihana-bulldogs-truck.jpg`, width: 1200, height: 630, alt: 'Meihana with dogs — 2 Little Leashes Rotorua' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Meihana | 2 Little Leashes Dog Walkers Rotorua',
    description: 'Meet Meihana, the Rotorua-based founder of 2 Little Leashes. Local family business, photo update every session.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/images/meihana-bulldogs-truck.jpg`],
  },
}

const WHY_US: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Camera,    title: 'Photo after every session',   body: 'We send a photo update after every walk or visit so you can see your dog having the time of their life.' },
  { icon: MapPin,    title: 'Rotorua\'s best locations',    body: 'Forests, lake tracks, and bush paths — we mix up locations so walks stay exciting and stimulating.' },
  { icon: Compass,   title: "Rotorua's best locations",    body: 'Forests, lake tracks, bush paths — we mix up locations so walks stay exciting and stimulating.' },
  { icon: Car,       title: 'Free pick-up & drop-off',     body: 'We come to you. Your dog is collected and returned safely from your home.' },
  { icon: Pill,      title: 'Medical care welcome',        body: 'Medication administration and dogs with special needs are welcome — just let us know at booking.' },
  { icon: Handshake, title: 'Meet & greet first',          body: 'Before any walk we visit your home, meet your dog, and understand their needs. No surprises.' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden bg-forest-700 px-4 py-14 min-h-96 sm:px-6 lg:px-8">
        <Image
          src="/images/about-hero.jpg"
          alt="Meihana with dogs — 2 Little Leashes Rotorua"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 35%' }}
          priority
        />
        <div className="absolute inset-0 bg-forest-700/80" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">About us</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white">Our Whānau, Our Business</h1>
          <p className="mt-3 text-white text-sm max-w-xl">
            A family dog walking and care business, built with love — right here in Rotorua.
          </p>
        </div>
      </section>

      {/* Bio card — full width */}
      <div className="bg-forest-700 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
            <Image src="/images/meihana.jpg" alt="Meihana" fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Meihana Herbert</h2>
            <p className="text-sm text-mint mb-4">Business Owner and Dad · 2 Little Leashes Rotorua</p>
            <p className="text-sm text-white/75 leading-relaxed">
              Kia ora! We&apos;re a whānau dog walking and care business right here in Rotorua.
            </p>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">
              At 2 Little Leashes, it&apos;s all about the girls. They&apos;ve grown up surrounded by dogs and cats their whole lives. Not long ago, we said goodbye to our beloved Corgi, Odie, who lived with us for 13 amazing years. He wasn&apos;t just a pet — he was part of our whānau.
            </p>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">
              Now we&apos;ve welcomed Coby and Tahu, our Auntie&apos;s cheeky British Bulldogs into our crew. Loud, lazy, funny, and full of personality — just like the girls.
            </p>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">
              The girls came up with the idea themselves, and named it 2 Little Leashes all on their own. This isn&apos;t just a hobby — it&apos;s a lesson in commitment, care, and community.
            </p>
          </div>
        </div>
      </div>

      {/* Why us — full width */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
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
      </div>

      {/* CTA */}
      <div className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-amber-900 mb-2">Ready to meet us?</h2>
            <p className="text-sm text-amber-800 mb-5">Book online and we'll arrange a meet &amp; greet at your home before your first session.</p>
            <Link href="/book" className="btn-primary px-6 py-3">Book a walk →</Link>
            </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
