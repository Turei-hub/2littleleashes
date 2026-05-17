// src/app/api/book/route.ts
// POST /api/book
// Validates the booking form, sends customer confirmation + owner alert.

import { NextRequest, NextResponse } from 'next/server'
import { sendCustomerConfirmation, sendOwnerAlert } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      ownerName,
      email,
      phone,
      suburb,
      dogName,
      breed,
      service,
      preferredDate,
      meetGreetPref,
      notes,
    } = body

    // Basic server-side validation
    if (!ownerName?.trim())   return NextResponse.json({ error: 'Name is required' },     { status: 400 })
    if (!email?.trim())       return NextResponse.json({ error: 'Email is required' },    { status: 400 })
    if (!dogName?.trim())     return NextResponse.json({ error: "Dog's name required" },  { status: 400 })
    if (!service?.trim())     return NextResponse.json({ error: 'Service is required' },  { status: 400 })
    if (!meetGreetPref?.trim()) return NextResponse.json({ error: 'Meet & greet preference required' }, { status: 400 })

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const bookingData = {
      ownerName: ownerName.trim(),
      email:     email.trim().toLowerCase(),
      phone:     phone?.trim()        || '',
      suburb:    suburb?.trim()       || '',
      dogName:   dogName.trim(),
      breed:     breed?.trim()        || '',
      service:   service.trim(),
      preferredDate: preferredDate?.trim() || '',
      meetGreetPref: meetGreetPref.trim(),
      notes:     notes?.trim()        || '',
    }

    // Fire both emails concurrently
    await Promise.all([
      sendCustomerConfirmation(bookingData),
      sendOwnerAlert(bookingData),
    ])

    return NextResponse.json(
      { success: true, message: `Booking received for ${dogName}! Check your inbox.` },
      { status: 200 }
    )
  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}
