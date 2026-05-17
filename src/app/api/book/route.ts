// src/app/api/book/route.ts
// POST /api/book
// Validates the booking form, saves to Supabase, and sends emails.

import { NextRequest, NextResponse } from 'next/server'
import { sendCustomerConfirmation, sendOwnerAlert } from '@/lib/email'
import { supabase } from '@/lib/supabase'

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
    if (!ownerName?.trim())     return NextResponse.json({ error: 'Name is required' },                      { status: 400 })
    if (!email?.trim())         return NextResponse.json({ error: 'Email is required' },                     { status: 400 })
    if (!dogName?.trim())       return NextResponse.json({ error: "Dog's name required" },                   { status: 400 })
    if (!service?.trim())       return NextResponse.json({ error: 'Service is required' },                   { status: 400 })
    if (!meetGreetPref?.trim()) return NextResponse.json({ error: 'Meet & greet preference required' },      { status: 400 })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const bookingData = {
      ownerName:     ownerName.trim(),
      email:         email.trim().toLowerCase(),
      phone:         phone?.trim()        || '',
      suburb:        suburb?.trim()       || '',
      dogName:       dogName.trim(),
      breed:         breed?.trim()        || '',
      service:       service.trim(),
      preferredDate: preferredDate?.trim() || '',
      meetGreetPref: meetGreetPref.trim(),
      notes:         notes?.trim()        || '',
    }

    // 1. Save to Supabase (required — fail fast if this errors)
    const { error: dbError } = await supabase.from('bookings').insert({
      owner_name:      bookingData.ownerName,
      email:           bookingData.email,
      phone:           bookingData.phone,
      suburb:          bookingData.suburb,
      dog_name:        bookingData.dogName,
      breed:           bookingData.breed,
      service:         bookingData.service,
      preferred_date:  bookingData.preferredDate,
      meet_greet_pref: bookingData.meetGreetPref,
      notes:           bookingData.notes,
    })

    if (dbError) {
      console.error('Supabase insert error:', dbError)
      return NextResponse.json(
        { error: 'Could not save booking. Please try again.' },
        { status: 500 }
      )
    }

    // 2. Send emails (best-effort — booking is already saved)
    try {
      await Promise.all([
        sendCustomerConfirmation(bookingData),
        sendOwnerAlert(bookingData),
      ])
    } catch (emailError) {
      console.error('Email send error (booking saved):', emailError)
    }

    return NextResponse.json(
      { success: true, message: `Booking received for ${bookingData.dogName}! Check your inbox.` },
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
