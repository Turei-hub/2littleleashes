'use client'
// src/components/PricingCalculator.tsx

import { useState } from 'react'
import Link from 'next/link'

type ServiceKey = 'walk-1x' | 'walk-multi' | 'wash' | 'checkin' | 'checkin-walk' | 'endurance'

interface ServiceOption {
  label:     string
  base:      number
  perVisit:  boolean
  weekly:    boolean
  supportsExtraDogs: boolean
}

const SERVICES: Record<ServiceKey, ServiceOption> = {
  'walk-1x':      { label: 'Dog walk (1x/week)',       base: 30, perVisit: true,  weekly: true,  supportsExtraDogs: true },
  'walk-multi':   { label: 'Dog walk (2+/week)',        base: 20, perVisit: true,  weekly: true,  supportsExtraDogs: true },
  'wash':         { label: 'Dog wash',                  base: 20, perVisit: false, weekly: false, supportsExtraDogs: false },
  'checkin':      { label: 'Home check-in',             base: 20, perVisit: true,  weekly: true,  supportsExtraDogs: false },
  'checkin-walk': { label: 'Home check-in + walk',      base: 45, perVisit: true,  weekly: true,  supportsExtraDogs: true },
  'endurance':    { label: 'Endurance run (Sundays)',   base: 50, perVisit: false, weekly: false, supportsExtraDogs: false },
}

export default function PricingCalculator() {
  const [service,   setService]   = useState<ServiceKey>('walk-1x')
  const [dogs,      setDogs]      = useState(1)
  const [frequency, setFrequency] = useState(1)
  const [weekend,   setWeekend]   = useState(false)

  const svc        = SERVICES[service]
  const extraDogs  = svc.supportsExtraDogs ? Math.max(0, dogs - 1) * 10 : 0
  const wkndFee    = weekend ? 20 : 0
  const perVisit   = svc.base + extraDogs + wkndFee
  const weeklyTotal = svc.weekly ? perVisit * frequency : perVisit

  return (
    <div className="rounded-xl border border-forest-700/10 bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-semibold text-forest-700 mb-4">
        Estimate your cost
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Service */}
        <div className="field">
          <label>Service type</label>
          <select value={service} onChange={e => setService(e.target.value as ServiceKey)}>
            {(Object.entries(SERVICES) as [ServiceKey, ServiceOption][]).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Dogs */}
        <div className="field">
          <label>Number of dogs</label>
          <input
            type="number"
            min={1} max={5}
            value={dogs}
            onChange={e => setDogs(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        {/* Frequency — only relevant for weekly services */}
        {svc.weekly && (
          <div className="field">
            <label>Walks per week</label>
            <input
              type="number"
              min={1} max={7}
              value={frequency}
              onChange={e => setFrequency(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        )}

        {/* Weekend */}
        <div className="field">
          <label>Weekend visit?</label>
          <select value={weekend ? 'yes' : 'no'} onChange={e => setWeekend(e.target.value === 'yes')}>
            <option value="no">No — weekday</option>
            <option value="yes">Yes — +$20 surcharge</option>
          </select>
        </div>
      </div>

      {/* Result */}
      <div className="mt-5 rounded-xl bg-forest-700 p-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium text-white/50 uppercase tracking-wide">Per visit</p>
            <p className="font-display text-4xl font-bold text-white">${perVisit}</p>
          </div>
          {svc.weekly && frequency > 1 && (
            <div className="text-right">
              <p className="text-xs font-medium text-white/50 uppercase tracking-wide">Weekly total</p>
              <p className="font-display text-2xl font-semibold text-amber-300">${weeklyTotal}</p>
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-xs text-white/60">
          <div className="flex justify-between"><span>Base ({svc.label})</span><span>${svc.base}</span></div>
          {extraDogs > 0 && <div className="flex justify-between"><span>Extra dogs ({dogs - 1} × $10)</span><span>${extraDogs}</span></div>}
          {wkndFee   > 0 && <div className="flex justify-between"><span>Weekend surcharge</span><span>${wkndFee}</span></div>}
          {service === 'walk-multi' && frequency > 1 && (
            <div className="flex justify-between text-amber-300"><span>Multi-walk discount applied ✓</span><span>–</span></div>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-forest-600/60">
        * First walk is FREE for new clients. Weekend surcharge (+$20) applies to Saturday & Sunday bookings.
      </p>

      <Link href="/book" className="btn-primary mt-4 w-full justify-center">
        Book this service →
      </Link>
    </div>
  )
}
