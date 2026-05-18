import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createSessionClient } from '@/lib/supabase-server'
import { sendBookingConfirmed } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data: { session } } = await createSessionClient().auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const body = await req.json()

  if (body.action === 'verify-payment') {
    // Fetch booking for confirmation email
    const { data: booking } = await supabase
      .from('bookings')
      .select('owner_name, email, dog_name, preferred_date')
      .eq('id', params.id)
      .single()

    const { error } = await supabase
      .from('bookings')
      .update({ payment_status: 'verified', status: 'confirmed' })
      .eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Best-effort confirmation email
    if (booking) {
      try {
        await sendBookingConfirmed({
          ownerName:     booking.owner_name,
          email:         booking.email,
          dogName:       booking.dog_name,
          preferredDate: booking.preferred_date,
        })
      } catch {}
    }

    return NextResponse.json({ success: true })
  }

  // Existing status update logic
  const { status } = body
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
