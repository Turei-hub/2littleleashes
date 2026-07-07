import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createSessionClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// Admin-only photo upload. Unlike the public /api/gallery/submit route (which
// inserts as 'pending' for moderation), this requires a logged-in session and
// publishes the photo straight to the gallery with status 'approved'.
export async function POST(req: NextRequest) {
  const { data: { session } } = await createSessionClient().auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const dogName  = formData.get('dog_name') as string | null
  const caption  = formData.get('caption')  as string | null
  const file     = formData.get('image')    as File   | null

  if (!dogName?.trim()) {
    return NextResponse.json({ error: "Dog's name is required" }, { status: 400 })
  }
  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'Photo is required' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Photo must be under 5 MB' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const ext  = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('gallery-uploads')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('gallery-uploads')
    .getPublicUrl(path)

  const { error: dbError } = await supabase
    .from('gallery_submissions')
    .insert({
      dog_name:  dogName.trim(),
      caption:   caption?.trim() || null,
      image_url: publicUrl,
      status:    'approved', // admin uploads skip moderation — live immediately
    })

  if (dbError) {
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
