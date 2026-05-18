import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email?.trim()) return NextResponse.json({ isReturning: false })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { count } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('email', email.trim().toLowerCase())

    return NextResponse.json({ isReturning: (count ?? 0) > 0 })
  } catch {
    return NextResponse.json({ isReturning: false })
  }
}
