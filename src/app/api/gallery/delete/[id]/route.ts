import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createSessionClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data: { session } } = await createSessionClient().auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: record, error: fetchError } = await supabase
    .from('gallery_submissions')
    .select('image_url')
    .eq('id', params.id)
    .single()

  if (fetchError || !record) {
    return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }

  // Extract filename from public URL:
  // https://xxx.supabase.co/storage/v1/object/public/gallery-uploads/FILENAME
  const BUCKET_PREFIX = '/storage/v1/object/public/gallery-uploads/'
  const storagePath = (record.image_url as string).split(BUCKET_PREFIX)[1] ?? null

  if (storagePath) {
    await supabase.storage.from('gallery-uploads').remove([storagePath])
  }

  const { error: dbError } = await supabase
    .from('gallery_submissions')
    .delete()
    .eq('id', params.id)

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
