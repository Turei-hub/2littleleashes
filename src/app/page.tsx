// src/app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceCard from '@/components/ServiceCard'
import { SERVICES, POLICIES } from '@/lib/data'

const WHY_CHOOSE = [
  { icon: '🐾', title: 'Local Family Business', body: 'Safe, friendly & full of care' },
  { icon: '🐶', title: 'Always Supervised by Dad', body: 'Owner and main point of contact' },
  { icon: '🦴', title: 'Love, Laughs & Happy Tails', body: 'Every walk comes with genuine fun and care' },
  { icon: '💌', title: 'Flexible & Affordable', body: 'For every whānau' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        {/* Background photo */}
        <Image
          src="/images/Meihana1.jpg"
          alt="Meihana walking dogs in Rotorua"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark teal overlay for text readability */}
        <div className="absolute inset-0 bg-forest-900/65" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="max-w-2xl animate-fade-up">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/75">
              📍 Rotorua, New Zealand · Est. 2022
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              2 Little Leashes Dog Walkers Rotorua
            </h1>

            <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
              Kia ora! We&apos;re 2 Little Leashes – A dog-crazy whānau who absolutely LOVE spending time with furry friends. Rain or shine, we&apos;re ready with leashes, smiles, treats, and heaps of energy!
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn-primary text-base px-6 py-3">
                Book a walk →
              </Link>
              <Link href="/services" className="btn-secondary text-base px-6 py-3">
                See all services
              </Link>
            </div>

            {/* Pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                '🎉 First walk FREE',
                '🏃 Sunday 10km endurance run',
                '📸 Photo update every session',
                '🚗 Free pick-up & drop-off',
                '📍 GPS every walk',
              ].map(pill => (
                <span
                  key={pill}
                  className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs text-white/70"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STAT BAR ──────────────────────────────────────────────────────────── */}
      <div className="bg-amber-200">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-forest-700/20 sm:grid-cols-4">
          {[
            { n: '$30',   l: 'From / walk' },
            { n: 'FREE',  l: 'First walk' },
            { n: '7 AM',  l: 'Start time' },
            { n: 'GPS',   l: 'Every walk' },
          ].map(s => (
            <div key={s.n} className="py-4 text-center">
              <p className="font-display text-xl font-bold text-forest-700">{s.n}</p>
              <p className="text-xs text-forest-600/70">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SERVICES ──────────────────────────────────────────────────────────── */}
      <section className="section">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest-600/60">What we offer</p>
        <h2 className="font-display mt-1 text-3xl font-bold text-forest-700">Four services, one team</h2>
        <p className="mt-2 text-sm text-forest-600">
          All services are personally supervised by Meihana. A meet &amp; greet at your home is required before your first booking.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(svc => (
            <ServiceCard
              key={svc.id}
              icon={svc.icon}
              title={svc.title}
              tagline={svc.tagline}
              priceLabel={svc.pricing.baseLabel}
              badge={svc.badge}
              highlight={svc.highlight}
              compact
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/services" className="btn-outline">
            View full pricing & details →
          </Link>
        </div>
      </section>

      {/* ── FREE FIRST WALK BANNER ────────────────────────────────────────────── */}
      <section className="bg-amber-50 border-y border-amber-200 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex flex-col items-center text-center sm:flex-row sm:text-left sm:gap-8">
          <div className="text-5xl mb-4 sm:mb-0">🎉</div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-amber-900">Your first walk is FREE</h2>
            <p className="mt-1 text-sm text-amber-800">
              New clients get their first walk on us — so your dog can meet Meihana, get comfortable, and make sure it's a great fit before you commit to anything.
            </p>
          </div>
          <Link href="/book" className="mt-4 shrink-0 btn-primary sm:mt-0">
            Claim free walk →
          </Link>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────────── */}
      <section className="section">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest-600/60">Why choose us</p>
        <h2 className="font-display mt-1 text-3xl font-bold text-forest-700">We&apos;re different — here&apos;s why</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {WHY_CHOOSE.map(item => (
            <div key={item.title} className="flex gap-4 rounded-xl border border-forest-700/10 bg-forest-50 p-5">
              <div className="text-3xl shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-forest-700">{item.title}</h3>
                <p className="mt-1 text-sm text-forest-600/80">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POLICIES ──────────────────────────────────────────────────────────── */}
      <section className="section">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest-600/60">How we work</p>
        <h2 className="font-display mt-1 text-3xl font-bold text-forest-700">What to expect</h2>
        <p className="mt-2 text-sm text-forest-600">Simple policies, no surprises.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POLICIES.map(p => (
            <div key={p.title} className="rounded-xl bg-forest-50 border border-forest-700/10 p-5">
              <div className="mb-2 text-2xl">{p.icon}</div>
              <h3 className="font-semibold text-forest-700 text-sm">{p.title}</h3>
              <p className="mt-1 text-xs text-forest-600 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-forest-700 px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-4xl mb-4">🐾</p>
          <h2 className="font-display text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-3 text-white/65 text-sm">
            Fill out the booking form and Meihana will be in touch within 24 hours to arrange your free meet &amp; greet.
          </p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link href="/book" className="btn-primary px-6 py-3">
              Book now — first walk free →
            </Link>
            <Link href="/services" className="btn-secondary px-6 py-3">
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
