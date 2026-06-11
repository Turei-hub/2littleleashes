'use client'
// src/components/PricingCalculator.tsx

import { useState } from 'react'
import Link from 'next/link'

type ServiceKey = 'walk-1x' | 'walk-multi' | 'wash' | 'checkin' | 'checkin-walk'

interface ServiceOption {
  label:     string
  base:      number
  perVisit:  boolean
  weekly:    boolean
  supportsExtraDogs: boolean
}

const SERVICES: Record<ServiceKey, ServiceOption> = {
  'walk-1x':      { label: 'Dog walk (1x/week)',       base: 30, perVisit: true,  weekly: true,  supportsExtraDogs: true },
  'walk-multi':   { label: 'Dog walk (2+/week)',        base: 25, perVisit: true,  weekly: true,  supportsExtraDogs: true },
  'wash':         { label: 'Dog wash',                  base: 25, perVisit: false, weekly: false, supportsExtraDogs: false },
  'checkin':      { label: 'Home check-in',             base: 25, perVisit: true,  weekly: true,  supportsExtraDogs: false },
  'checkin-walk': { label: 'Home check-in + walk',      base: 50, perVisit: true,  weekly: true,  supportsExtraDogs: true },
}

function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-forest-700/20 bg-forest-50 text-lg font-bold text-forest-700 transition hover:bg-forest-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="flex-1 rounded-lg border border-forest-700/20 bg-white py-2 text-center text-base font-semibold text-forest-700">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-forest-700/20 bg-forest-50 text-lg font-bold text-forest-700 transition hover:bg-forest-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function PricingCalculator() {
  const [service,   setService]   = useState<ServiceKey>('walk-1x')
  const [dogs,      setDogs]      = useState(0)
  const [frequency, setFrequency] = useState(0)
  const [weekend,   setWeekend]   = useState(false)

  const svc        = SERVICES[service]
  const extraDogs  = svc.supportsExtraDogs ? Math.max(0, dogs - 1) * 15 : 0
  const wkndFee    = weekend ? 20 : 0
  const perVisit   = svc.base + extraDogs + wkndFee
  const weeklyTotal = svc.weekly ? perVisit * frequency : perVisit

  return (
    <div className="rounded-xl border border-forest-700/10 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="font-display text-lg font-semibold text-forest-700 mb-4">
        Estimate your cost
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Service */}
        <div className="field sm:col-span-2">
          <label>Service type</label>
          <select value={service} onChange={e => setService(e.target.value as ServiceKey)}>
            {(Object.entries(SERVICES) as [ServiceKey, ServiceOption][]).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Dogs */}
        <Counter label="Number of dogs" value={dogs} min={0} max={5} onChange={setDogs} />

        {/* Frequency — only relevant for weekly services */}
        {svc.weekly && (
          <Counter label="Walks per week" value={frequency} min={0} max={7} onChange={setFrequency} />
        )}

        {/* Weekend toggle */}
        <div className={`field ${svc.weekly ? 'sm:col-span-2' : ''}`}>
          <label>Weekend visit?</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setWeekend(false)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                !weekend
                  ? 'border-forest-700 bg-forest-700 text-white'
                  : 'border-forest-700/20 bg-forest-50 text-forest-600 hover:bg-forest-100'
              }`}
            >
              Weekday
            </button>
            <button
              type="button"
              onClick={() => setWeekend(true)}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                weekend
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-forest-700/20 bg-forest-50 text-forest-600 hover:bg-forest-100'
              }`}
            >
              Weekend +$20
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-5 rounded-xl bg-forest-700 p-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium text-mint uppercase tracking-wide">Per visit</p>
            <p className="font-display text-4xl font-bold text-white">${perVisit}</p>
          </div>
          {svc.weekly && frequency > 1 && (
            <div className="text-right">
              <p className="text-xs font-medium text-mint uppercase tracking-wide">Weekly total</p>
              <p className="font-display text-2xl font-semibold text-amber-300">${weeklyTotal}</p>
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-xs text-white/75">
          <div className="flex justify-between"><span>Base ({svc.label})</span><span>${svc.base}</span></div>
          {extraDogs > 0 && (
            <>
              <div className="flex justify-between"><span>Extra dogs ({dogs - 1} × $15)</span><span>${extraDogs}</span></div>
              <div className="text-white/50 text-[10px]">First dog ${svc.base} · each additional dog $15</div>
            </>
          )}
          {wkndFee > 0 && <div className="flex justify-between"><span>Weekend surcharge</span><span>${wkndFee}</span></div>}
          {service === 'walk-multi' && frequency > 1 && (
            <div className="flex justify-between text-amber-300"><span>Multi-walk discount applied ✓</span><span>–</span></div>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-forest-600/60">
        * Weekend surcharge (+$20) applies to Saturday & Sunday bookings.
      </p>

      <Link href="/book" className="btn-primary mt-4 w-full justify-center">
        Book this service →
      </Link>
    </div>
  )
}
