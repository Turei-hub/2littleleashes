// src/components/Footer.tsx
import Link from 'next/link'
import { PawPrint, Clock, CalendarDays, MapPin, Car } from 'lucide-react'

const HOURS_INFO = [
  { icon: Clock,        text: 'Mon–Fri: 7:00 AM – 2:00 PM' },
  { icon: CalendarDays, text: 'Weekend: +$20 surcharge' },
  { icon: MapPin,       text: 'Based in Rotorua, NZ' },
  { icon: Car,          text: 'Free pick-up & drop-off' },
]

export default function Footer() {
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
              Professional dog walking and caring in Rotorua, New Zealand. GPS-tracked, photo updates every session.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Quick links</h3>
            <ul className="space-y-2 text-xs">
              {[
                { href: '/',         label: 'Home' },
                { href: '/services', label: 'Services & Pricing' },
                { href: '/about',    label: 'About Meihana' },
                { href: '/book',     label: 'Book a walk' },
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
              {HOURS_INFO.map(({ icon: InfoIcon, text }) => (
                <li key={text} className="flex items-center gap-1.5">
                  <InfoIcon size={11} className="shrink-0 text-white/40" />
                  {text}
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
