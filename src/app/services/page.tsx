// src/app/services/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Plus } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PricingCalculator from '@/components/PricingCalculator'
import { SERVICES, POLICIES } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Services & Pricing | 2 Little Leashes Rotorua',
  description: 'Dog walking from $30, dog wash $25, home check-ins $25. Free pick-up and drop-off in Rotorua, NZ.',
  alternates: { canonical: 'https://www.2littleleashes.co.nz/services' },
  openGraph: {
    title: 'Services & Pricing | 2 Little Leashes Rotorua',
    description: 'Dog walking from $30, dog wash $25, home check-ins $25. Free pick-up and drop-off in Rotorua, NZ.',
    url: 'https://www.2littleleashes.co.nz/services',
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/pack-walk-truck.jpg`, width: 1200, height: 630, alt: '2 Little Leashes pack walk Rotorua' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services & Pricing | 2 Little Leashes Rotorua',
    description: 'Dog walking from $30, dog wash $25, home check-ins $25. Free pick-up and drop-off in Rotorua.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/images/pack-walk-truck.jpg`],
  },
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden bg-forest-700 px-4 py-14 min-h-72 sm:px-6 lg:px-8">
        <Image
          src="/images/services-hero.jpg"
          alt="2 Little Leashes dog walking services Rotorua"
          fill
          className="object-cover"
          style={{ objectPosition: 'center center' }}
          priority
        />
        <div className="absolute inset-0 bg-forest-700/80" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Services & Pricing</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white">
            Transparent pricing, no surprises
          </h1>
          <p className="mt-3 text-white text-sm max-w-xl">
            Every service includes free pick-up and drop-off. Weekend bookings carry a +$20 surcharge.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">

        {/* Service detail cards */}
        {SERVICES.map(svc => {
          const SvcIcon = svc.icon
          return (
            <div key={svc.id} className="rounded-xl border border-forest-700/10 bg-white shadow-sm overflow-hidden">
              <div className="flex items-start justify-between gap-4 p-6 flex-wrap">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-forest-700">
                    <SvcIcon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-forest-700">{svc.title}</h2>
                  <p className="text-sm text-forest-600 mt-0.5">{svc.tagline}</p>
                  {'schedule' in svc && (
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                        {(svc as { schedule: string }).schedule}
                      </span>
                      <span className="text-xs text-forest-600">
                        {'duration' in svc ? (svc as { duration: string }).duration : ''}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-3xl font-bold text-forest-700">${svc.pricing.base}</p>
                  <p className="text-xs text-forest-600">{svc.pricing.baseLabel}</p>
                  {'multiWalk' in svc.pricing && (
                    <p className="mt-1 text-xs font-semibold text-forest-600">
                      {(svc.pricing as { multiWalkLabel: string }).multiWalkLabel}
                    </p>
                  )}
                  {'extraDogLabel' in svc.pricing && (
                    <p className="text-xs font-bold text-forest-700">
                      {(svc.pricing as { extraDogLabel: string }).extraDogLabel}
                    </p>
                  )}
                  {'addon' in svc.pricing && (
                    <p className="mt-1 text-xs font-semibold text-forest-600">
                      {(svc.pricing as { addon: string }).addon}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-forest-700/8 px-6 py-5">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {svc.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-forest-600">
                      <span className="mt-0.5 shrink-0 text-forest-500 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {'targetBreeds' in svc && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-forest-700 mb-2">Best suited for:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(svc as { targetBreeds: readonly string[] }).targetBreeds.map(b => (
                        <span key={b} className="rounded-full bg-forest-50 border border-forest-700/15 px-2.5 py-0.5 text-xs text-forest-700">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {svc.specialNote && (
                <div className="border-t border-amber-200 bg-amber-50 px-6 py-4">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-amber-800">
                    <Sparkles size={14} className="shrink-0 text-amber-600" />
                    {svc.specialNote}
                  </p>
                </div>
              )}

              {!svc.specialNote && (svc as { specialNote: null }).specialNote === null && 'addon' in svc.pricing && (
                <div className="border-t border-forest-700/8 bg-forest-50 px-6 py-4">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-forest-700">
                    <Plus size={14} className="shrink-0 text-forest-600" />
                    {(svc.pricing as { addon: string }).addon}
                  </p>
                </div>
              )}
            </div>
          )
        })}

        {/* Policies */}
        <div>
          <h2 className="font-display text-2xl font-bold text-forest-700 mb-6">Policies & logistics</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>

        {/* Calculator */}
        <PricingCalculator />

        {/* CTA */}
        <div className="rounded-xl bg-forest-700 p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Ready to book?</h2>
          <p className="text-white/65 text-sm mb-5">No lock-in, no contracts. Free pick-up and drop-off included.</p>
          <Link href="/book" className="btn-primary px-6 py-3">Book now →</Link>
        </div>
      </div>

      <Footer />
    </>
  )
}
