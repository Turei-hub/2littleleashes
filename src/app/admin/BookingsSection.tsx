'use client'

import { useState } from 'react'
import BookingActions from './BookingActions'

export type Booking = {
  id: string
  owner_name: string
  email: string
  phone: string
  suburb: string
  dog_name: string
  breed: string
  service: string
  preferred_date: string
  meet_greet_pref: string
  notes: string
  status: string
  created_at: string
  payment_status: string | null
  payment_screenshot_url: string | null
  payment_reference: string | null
}

type Filter = 'all' | 'pending' | 'confirmed' | 'cancelled'

const FILTERS: { value: Filter; label: string; activeClass: string }[] = [
  { value: 'all',       label: 'All',       activeClass: 'bg-forest-700 text-white' },
  { value: 'pending',   label: 'Pending',   activeClass: 'bg-amber-500 text-white' },
  { value: 'confirmed', label: 'Confirmed', activeClass: 'bg-green-600 text-white' },
  { value: 'cancelled', label: 'Cancelled', activeClass: 'bg-red-500 text-white' },
]

function StatusBadge({ status }: { status: string }) {
  const cls = {
    pending:   'bg-amber-100 text-amber-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
  }[status] ?? 'bg-gray-100 text-gray-600'

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function PaymentBadge({ status, url }: { status: string; url: string | null }) {
  if (status === 'verified') {
    return (
      <span className="inline-flex rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
        Verified ✓
      </span>
    )
  }
  if (status === 'uploaded' && url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 hover:bg-green-200"
      >
        Screenshot ↗
      </a>
    )
  }
  return <span className="text-xs text-forest-600/40">No payment</span>
}

export default function BookingsSection({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const counts: Record<Filter, number> = {
    all:       bookings.length,
    pending:   bookings.filter(b => (b.status ?? 'pending') === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => (b.status ?? 'pending') === filter)

  return (
    <>
      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              filter === f.value
                ? f.activeClass
                : 'bg-white border border-forest-700/15 text-forest-600 hover:border-forest-700/30 hover:text-forest-700'
            }`}
          >
            {f.label}
            <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
              filter === f.value ? 'bg-white/25 text-white' : 'bg-forest-50 text-forest-600'
            }`}>
              {counts[f.value]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-forest-700/10 bg-white p-16 text-center text-sm text-forest-600/50">
          No {filter === 'all' ? '' : filter} bookings.
        </div>
      ) : (
        <>
          {/* ── Mobile card layout (< md) ─────────────────────────────────────── */}
          <div className="space-y-3 md:hidden">
            {filtered.map(b => (
              <div key={b.id} className="rounded-xl border border-forest-700/10 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-forest-700 truncate">{b.owner_name}</p>
                    <p className="text-xs text-forest-600/60 truncate">{b.email}</p>
                  </div>
                  <StatusBadge status={b.status ?? 'pending'} />
                </div>
                <div className="mb-3 space-y-1 text-sm">
                  <p className="text-forest-700">
                    <span className="text-xs text-forest-600/50">Dog: </span>
                    {b.dog_name}{b.breed ? ` (${b.breed})` : ''}
                  </p>
                  <p className="text-forest-600 line-clamp-1">
                    <span className="text-xs text-forest-600/50">Service: </span>
                    {b.service}
                  </p>
                </div>
                <BookingActions
                  id={b.id}
                  currentStatus={b.status ?? 'pending'}
                  paymentStatus={b.payment_status ?? 'none'}
                  screenshotUrl={b.payment_screenshot_url}
                />
              </div>
            ))}
          </div>

          {/* ── Desktop table layout (≥ md) ───────────────────────────────────── */}
          <div className="hidden overflow-hidden rounded-xl border border-forest-700/10 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-forest-700/10 bg-forest-50 text-left text-xs font-semibold uppercase tracking-wide text-forest-600/50">
                    <th className="px-4 py-3">Received</th>
                    <th className="px-4 py-3">Owner</th>
                    <th className="px-4 py-3">Dog</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Preferred date</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-700/8">
                  {filtered.map(b => (
                    <tr key={b.id} className="hover:bg-forest-50/50 transition-colors">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-forest-600/60">
                        {new Date(b.created_at).toLocaleDateString('en-NZ', {
                          day: 'numeric', month: 'short', year: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-forest-700">{b.owner_name}</p>
                        <p className="text-xs text-forest-600/60">{b.email}</p>
                        {b.phone && <a href={`tel:${b.phone.replace(/\s/g, '')}`} className="text-xs text-forest-600/60 hover:text-forest-700 hover:underline">{b.phone}</a>}
                        {b.suburb && <p className="text-xs text-forest-600/50">{b.suburb}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-forest-700">{b.dog_name}</p>
                        {b.breed && <p className="text-xs text-forest-600/60">{b.breed}</p>}
                      </td>
                      <td className="px-4 py-3 text-forest-700">{b.service}</td>
                      <td className="px-4 py-3 text-xs text-forest-600/70">{b.preferred_date || '—'}</td>
                      <td className="max-w-[180px] px-4 py-3 text-xs text-forest-600/70">
                        {b.notes ? (
                          <span title={b.notes} className="line-clamp-2">{b.notes}</span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={b.status ?? 'pending'} />
                      </td>
                      <td className="px-4 py-3">
                        <PaymentBadge status={b.payment_status ?? 'none'} url={b.payment_screenshot_url} />
                      </td>
                      <td className="px-4 py-3">
                        <BookingActions
                          id={b.id}
                          currentStatus={b.status ?? 'pending'}
                          paymentStatus={b.payment_status ?? 'none'}
                          screenshotUrl={b.payment_screenshot_url}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  )
}
