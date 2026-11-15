// src/app/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Shield, Smile, DollarSign, Camera, Car, MapPin, PawPrint } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: '2 Little Leashes Dog Walkers | Rotorua, NZ',
  description: 'Professional dog walking, washing, and home check-ins in Rotorua, NZ. Photo update every session.',
  alternates: { canonical: 'https://www.2littleleashes.co.nz' },
  openGraph: {
    title: '2 Little Leashes Dog Walkers | Rotorua, NZ',
    description: 'Professional dog walking and caring in Rotorua. Photo update every session.',
    url: 'https://www.2littleleashes.co.nz',
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/dog-walk-rotorua.jpg`, width: 1200, height: 630, alt: '2 Little Leashes dog walk in Rotorua' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '2 Little Leashes Dog Walkers | Rotorua, NZ',
    description: 'Professional dog walking and caring in Rotorua. Photo update every session.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/images/dog-walk-rotorua.jpg`],
  },
}
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getPolicies } from '@/lib/data'
import { getContent } from '@/lib/content'

const WHY_CHOOSE_ICONS: LucideIcon[] = [Heart, Shield, Smile, DollarSign]
const HERO_PILL_ICONS: LucideIcon[] = [Camera, Car]

export default async function HomePage() {
  const c = await getContent()
  const WHY_CHOOSE = WHY_CHOOSE_ICONS.map((icon, i) => ({
    icon, title: c[`home.why.${i + 1}.title`], body: c[`home.why.${i + 1}.body`],
  }))
  const HERO_PILLS = HERO_PILL_ICONS.map((icon, i) => ({ icon, text: c[`home.hero.pill_${i + 1}`] }))
  const REVIEWS = [1, 2, 3, 4].map(n => ({ name: c[`home.reviews.${n}.name`], text: c[`home.reviews.${n}.text`] }))
  const POLICIES = getPolicies(c)
  return (
    <>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        {/* Background photo */}
        <Image
          src={c['home.hero.image']}
          alt="Meihana walking dogs in Rotorua"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark teal overlay for text readability */}
        <div className="absolute inset-0 bg-forest-900/65" />

        {/* Logo watermark — above overlay, behind text */}
        <div className="pointer-events-none absolute left-8 top-1/2 z-[5] hidden -translate-y-1/2 opacity-40 sm:block lg:left-16">
          <Image
            src="/images/logo.png"
            alt=""
            width={280}
            height={280}
            className="object-contain"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="max-w-2xl animate-fade-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/75">
              <MapPin size={12} />
              {c['home.hero.badge']}
            </div>

            <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {c['home.hero.title']}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
              {c['home.hero.intro']}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn-primary w-full sm:w-auto text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3">
                Pricing and Booking →
              </Link>
            </div>

            {/* Pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {HERO_PILLS.map(({ icon: PillIcon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs text-white/70"
                >
                  <PillIcon size={11} />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────────── */}
      <section className="section">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest-600">{c['home.why.eyebrow']}</p>
        <h2 className="font-display mt-1 text-3xl font-bold text-forest-700">{c['home.why.heading']}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {WHY_CHOOSE.map(item => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex gap-4 rounded-xl border border-forest-700/10 bg-forest-50 p-5">
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-forest-700">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-forest-700">{item.title}</h3>
                  <p className="mt-1 text-sm text-forest-600/80">{item.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── REVIEWS ───────────────────────────────────────────────────────────── */}
      <section className="bg-forest-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-forest-600">{c['home.reviews.eyebrow']}</p>
          <h2 className="font-display mt-1 text-3xl font-bold text-forest-700">{c['home.reviews.heading']}</h2>
          <p className="mt-2 text-sm text-forest-600">{c['home.reviews.subheading']}</p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {REVIEWS.map(review => {
              const initials = review.name.split(' ').map(n => n[0]).join('')
              return (
                <div key={review.name} className="flex flex-col rounded-xl border border-forest-700/10 bg-white p-6 shadow-sm">
                  <div className="mb-3 text-lg tracking-tight text-amber-400">★★★★★</div>
                  <p className="flex-1 text-sm leading-relaxed text-forest-600">&ldquo;{review.text}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-forest-700/8 pt-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-100 text-xs font-bold text-forest-700">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-forest-700">{review.name}</p>
                      <p className="text-xs text-forest-600">Facebook Review</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── POLICIES ──────────────────────────────────────────────────────────── */}
      <section className="section">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest-600">{c['home.policies.eyebrow']}</p>
        <h2 className="font-display mt-1 text-3xl font-bold text-forest-700">{c['home.policies.heading']}</h2>
        <p className="mt-2 text-sm text-forest-600">{c['home.policies.subheading']}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POLICIES.map(p => {
            const PIcon = p.icon
            return (
              <div key={p.title} className="rounded-xl bg-forest-50 border border-forest-700/10 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-forest-700">
                  <PIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-forest-700 text-sm">{p.title}</h3>
                <p className="mt-1 text-xs text-forest-600 leading-relaxed">{p.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-forest-700 px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500">
            <PawPrint className="h-7 w-7 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white">{c['home.cta.heading']}</h2>
          <p className="mt-3 text-white text-sm">
            {c['home.cta.body']}
          </p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link href="/book" className="btn-primary px-6 py-3">
              Pricing and Booking →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
