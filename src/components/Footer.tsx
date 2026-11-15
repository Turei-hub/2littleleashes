// src/components/Footer.tsx
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { PawPrint, Clock, CalendarDays, MapPin, Car } from 'lucide-react'
import { getContent } from '@/lib/content'

export default async function Footer() {
  const c = await getContent()
  const HOURS_INFO: { icon: LucideIcon; text: string; href?: string }[] = [
    { icon: Clock,        text: c['footer.hours'] },
    { icon: CalendarDays, text: `Weekend: +$${c['price.weekend_surcharge']} surcharge` },
    { icon: MapPin,       text: c['footer.location'] },
    { icon: Car,          text: c['footer.pickup'] },
  ]

  return (
    <footer className="bg-forest-700 text-white/60">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                <PawPrint className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-sm font-semibold text-white">2 Little Leashes</span>
            </div>
            <p className="text-xs leading-relaxed">
              {c['footer.tagline']}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Quick links</h3>
            <ul className="space-y-2 text-xs">
              {[
                { href: '/',         label: 'Home' },
                { href: '/about',    label: 'About Meihana' },
                { href: '/book',     label: 'Pricing and Booking' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Hours & info</h3>
            <ul className="space-y-1.5 text-xs">
              {HOURS_INFO.map(({ icon: InfoIcon, text, href }) => (
                <li key={text} className="flex items-center gap-1.5">
                  <InfoIcon size={11} className="shrink-0 text-white/40" />
                  {href
                    ? <a href={href} className="transition hover:text-white">{text}</a>
                    : text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col items-center gap-2 text-center text-xs sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} 2 Little Leashes Dog Walkers Rotorua · All rights reserved</p>
          <Link href="/admin/login" className="text-white/20 transition hover:text-white/50">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
