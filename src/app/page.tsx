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

const REVIEWS = [
  {
    name: 'Linda Van Staden',
    text: '2 Little Leashes has been a huge help with my dog, he absolutely loves his pack walks. Always comes back knackered but so happy! I always know where he is going and gets lots of photo updates. 10/10 would recommend 🙌',
  },
  {
    name: 'Donna Shaw',
    text: "Meihana is the bomb, he's so good with my girl MILO. She loves the runs he takes her on with the other fur babies. Interaction with the other dogs is soooo awesome. Meihana is a awesome trainer and she loves being with him and the other dogs would recommend him to anyone who is interested and looking for a great runner & dog handler.",
  },
  {
    name: 'Denise Frost',
    text: 'Highly recommend 2 Little Leashes. So happy with this Amazing service. Big ups to Meihana his wife and girls. Cica comes home so happy. Excellent communication as well. Always look forward to cicas next outing.',
  },
  {
    name: 'Ana Sassen',
    text: "Can't recommend 2 little leashes enough!!! My girl is very reactive, 2 little leashes were still keen to meet her. After 1 meeting they were keen to take her on. Today my little reactive girl Kai didn't react to him at all, came back without her halti on and so so happy.",
  },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        {/* Background photo */}
        <Image
          src="/images/meihana-bulldogs-truck.jpg"
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

      {/* ── REVIEWS ───────────────────────────────────────────────────────────── */}
      <section className="bg-forest-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-forest-600/60">Happy clients</p>
          <h2 className="font-display mt-1 text-3xl font-bold text-forest-700">What Rotorua families say</h2>
          <p className="mt-2 text-sm text-forest-600">Real reviews from real dog owners on Facebook.</p>

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
                      <p className="text-xs text-forest-600/50">Facebook Review</p>
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
