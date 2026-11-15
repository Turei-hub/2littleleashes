// src/app/about/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, MapPin, Car, Handshake, PawPrint } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getContent } from '@/lib/content'

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

const WHY_US_ICONS: LucideIcon[] = [Camera, MapPin, Car, Handshake]

export default async function AboutPage() {
  const c = await getContent()
  const WHY_US = WHY_US_ICONS.map((icon, i) => ({
    icon, title: c[`about.why.${i + 1}.title`], body: c[`about.why.${i + 1}.body`],
  }))

  return (
    <>
      <Navbar />

      <section className="relative overflow-hidden bg-forest-700 px-4 py-14 min-h-96 sm:px-6 lg:px-8">
        <Image
          src={c['about.hero.image']}
          alt="Meihana with dogs — 2 Little Leashes Rotorua"
          fill
          className="object-cover"
          style={{ objectPosition: 'center 35%' }}
          priority
        />
        <div className="absolute inset-0 bg-forest-700/80" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">{c['about.hero.eyebrow']}</p>
          <h1 className="font-display mt-1 text-2xl font-bold text-white sm:text-4xl">{c['about.hero.heading']}</h1>
          <p className="mt-3 text-white text-sm max-w-xl">
            {c['about.hero.subtitle']}
          </p>
        </div>
      </section>

      {/* Bio card — full width */}
      <div className="bg-forest-700 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
            <Image src={c['about.bio.image']} alt={c['about.bio.name']} fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">{c['about.bio.name']}</h2>
            <p className="text-sm text-mint mb-4">{c['about.bio.role']}</p>
            <p className="text-sm text-white/75 leading-relaxed">
              {c['about.bio.p1']}
            </p>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">
              {c['about.bio.p2']}
            </p>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">
              {c['about.bio.p3']}
            </p>
            <p className="mt-3 text-sm text-white/75 leading-relaxed">
              {c['about.bio.p4']}
            </p>
          </div>
        </div>
      </div>

      {/* Why us — full width */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold text-forest-700 mb-6">{c['about.why.heading']}</h2>
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
            <h2 className="font-display text-2xl font-bold text-amber-900 mb-2">{c['about.cta.heading']}</h2>
            <p className="text-sm text-amber-800 mb-5">{c['about.cta.body']}</p>
            <Link href="/book" className="btn-primary px-6 py-3">Pricing and Booking →</Link>
            </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
