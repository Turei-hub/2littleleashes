import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient, createSessionClient } from '@/lib/supabase-server'
import BookingsSection, { type Booking } from './BookingsSection'
import GallerySubmissionActions from './GallerySubmissionActions'
import LogoutButton from './LogoutButton'

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

        {/* Bookings table with filter */}
        <BookingsSection bookings={all} />

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
