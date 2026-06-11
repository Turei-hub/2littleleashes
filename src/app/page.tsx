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
import ServiceCard from '@/components/ServiceCard'
import { SERVICES, POLICIES } from '@/lib/data'

const WHY_CHOOSE: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Heart,      title: 'Local Family Business',      body: 'Safe, friendly & full of care' },
  { icon: Shield,     title: 'Always Supervised by Dad',   body: 'Owner and main point of contact' },
  { icon: Smile,      title: 'Love, Laughs & Happy Tails', body: 'Every walk comes with genuine fun and care' },
  { icon: DollarSign, title: 'Flexible & Affordable',      body: 'For every whānau' },
]

const HERO_PILLS: { icon: LucideIcon; text: string }[] = [
  { icon: Camera, text: 'Photo update every session' },
  { icon: Car,    text: 'Free pick-up & drop-off' },
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
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
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
              <MapPin size={12} />
              Rotorua, New Zealand · Est. 2022
            </div>

            <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              2 Little Leashes Dog Walkers Rotorua
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
              Kia ora! We&apos;re 2 Little Leashes – A dog-crazy whānau who absolutely LOVE spending time with furry friends. Rain or shine, we&apos;re ready with leashes, smiles, treats, and heaps of energy!
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn-primary w-full sm:w-auto text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3">
                Book a walk →
              </Link>
              <Link href="/services" className="btn-secondary w-full sm:w-auto text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3">
                See all services
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

      {/* ── SERVICES ──────────────────────────────────────────────────────────── */}
      <section className="section">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest-600">What we offer</p>
        <h2 className="font-display mt-1 text-3xl font-bold text-forest-700">Three services, one team</h2>
        <p className="mt-2 text-sm text-forest-600">
          All services are personally supervised by Meihana. A meet &amp; greet at your home is required before your first booking.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────────── */}
      <section className="section">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest-600">Why choose us</p>
        <h2 className="font-display mt-1 text-3xl font-bold text-forest-700">We&apos;re different — here&apos;s why</h2>
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
          <p className="text-xs font-semibold uppercase tracking-wider text-forest-600">Happy clients</p>
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
        <p className="text-xs font-semibold uppercase tracking-wider text-forest-600">How we work</p>
        <h2 className="font-display mt-1 text-3xl font-bold text-forest-700">What to expect</h2>
        <p className="mt-2 text-sm text-forest-600">Simple policies, no surprises.</p>

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
          <h2 className="font-display text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-3 text-white text-sm">
            Fill out the booking form and Meihana will be in touch within 24 hours to arrange your free meet &amp; greet.
          </p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link href="/book" className="btn-primary px-6 py-3">
              Book a walk →
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
