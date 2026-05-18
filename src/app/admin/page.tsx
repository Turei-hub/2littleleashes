import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient, createSessionClient } from '@/lib/supabase-server'
import BookingActions from './BookingActions'
import GallerySubmissionActions from './GallerySubmissionActions'
import LogoutButton from './LogoutButton'

type Booking = {
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

export default async function AdminPage() {
  const sessionClient = createSessionClient()
  const { data: { session } } = await sessionClient.auth.getSession()
  if (!session) redirect('/admin/login')

  const adminClient = createAdminClient()
  const [{ data: bookings }, { data: pendingPhotos }, { data: approvedPhotos }] = await Promise.all([
    adminClient.from('bookings').select('*').order('created_at', { ascending: false }),
    adminClient.from('gallery_submissions').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
    adminClient.from('gallery_submissions').select('*').eq('status', 'approved').order('created_at', { ascending: false }),
  ])

  const all       = (bookings ?? []) as Booking[]
  const pending   = all.filter(b => (b.status ?? 'pending') === 'pending').length
  const confirmed = all.filter(b => b.status === 'confirmed').length
  const weekAgo   = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const thisWeek  = all.filter(b => new Date(b.created_at) > weekAgo).length

  return (
    <div className="min-h-screen bg-forest-50">
      {/* Header */}
      <header className="bg-forest-700 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-xs text-white/50">2 Little Leashes · Admin</p>
            <h1 className="text-lg font-bold text-white">Bookings Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-white/25 px-3 py-1.5 text-sm font-medium text-white/60 transition hover:border-white/50 hover:text-white/90"
            >
              View Site →
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total bookings', value: all.length, highlight: false },
            { label: 'Pending',        value: pending,    highlight: pending > 0 },
            { label: 'Confirmed',      value: confirmed,  highlight: false },
            { label: 'This week',      value: thisWeek,   highlight: false },
          ].map(s => (
            <div
              key={s.label}
              className={`rounded-xl border p-4 ${
                s.highlight
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-forest-700/10 bg-white'
              }`}
            >
              <p className="text-2xl font-bold text-forest-700">{s.value}</p>
              <p className="text-xs text-forest-600/60">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings table */}
        {all.length === 0 ? (
          <div className="rounded-xl border border-forest-700/10 bg-white p-16 text-center text-sm text-forest-600/50">
            No bookings yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-forest-700/10 bg-white shadow-sm">
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
                  {all.map(b => (
                    <tr key={b.id} className="hover:bg-forest-50/50 transition-colors">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-forest-600/60">
                        {new Date(b.created_at).toLocaleDateString('en-NZ', {
                          day: 'numeric', month: 'short', year: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-forest-700">{b.owner_name}</p>
                        <p className="text-xs text-forest-600/60">{b.email}</p>
                        {b.phone && <p className="text-xs text-forest-600/60">{b.phone}</p>}
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
        )}

        {/* ── PENDING PHOTOS ──────────────────────────────────────────────────── */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-forest-700">
              Pending photos
              {(pendingPhotos?.length ?? 0) > 0 && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  {pendingPhotos!.length}
                </span>
              )}
            </h2>
          </div>

          {(pendingPhotos?.length ?? 0) === 0 ? (
            <div className="rounded-xl border border-forest-700/10 bg-white p-10 text-center text-sm text-forest-600/50">
              No pending photo submissions.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendingPhotos!.map((photo: {
                id: string
                dog_name: string
                caption: string | null
                image_url: string
                created_at: string
              }) => (
                <div key={photo.id} className="overflow-hidden rounded-xl border border-forest-700/10 bg-white shadow-sm">
                  <div className="relative aspect-video w-full bg-forest-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.image_url}
                      alt={photo.dog_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-forest-700">{photo.dog_name}</p>
                    {photo.caption && (
                      <p className="mt-0.5 text-xs text-forest-600">{photo.caption}</p>
                    )}
                    <p className="mt-1 text-xs text-forest-600/50">
                      {new Date(photo.created_at).toLocaleDateString('en-NZ', {
                        day: 'numeric', month: 'short', year: '2-digit',
                      })}
                    </p>
                    <div className="mt-3">
                      <GallerySubmissionActions id={photo.id} showApproveReject={true} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── APPROVED PHOTOS ─────────────────────────────────────────────────── */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-forest-700">
              Approved photos
              {(approvedPhotos?.length ?? 0) > 0 && (
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {approvedPhotos!.length}
                </span>
              )}
            </h2>
          </div>

          {(approvedPhotos?.length ?? 0) === 0 ? (
            <div className="rounded-xl border border-forest-700/10 bg-white p-10 text-center text-sm text-forest-600/50">
              No approved photos yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {approvedPhotos!.map((photo: {
                id: string
                dog_name: string
                caption: string | null
                image_url: string
                created_at: string
              }) => (
                <div key={photo.id} className="overflow-hidden rounded-xl border border-forest-700/10 bg-white shadow-sm">
                  <div className="relative aspect-video w-full bg-forest-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.image_url}
                      alt={photo.dog_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-forest-700">{photo.dog_name}</p>
                    {photo.caption && (
                      <p className="mt-0.5 text-xs text-forest-600">{photo.caption}</p>
                    )}
                    <p className="mt-1 text-xs text-forest-600/50">
                      {new Date(photo.created_at).toLocaleDateString('en-NZ', {
                        day: 'numeric', month: 'short', year: '2-digit',
                      })}
                    </p>
                    <div className="mt-3">
                      <GallerySubmissionActions id={photo.id} showApproveReject={false} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
