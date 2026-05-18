-- Gallery submissions table for client photo uploads
create table if not exists gallery_submissions (
  id         uuid        primary key default gen_random_uuid(),
  dog_name   text        not null,
  caption    text,
  image_url  text        not null,
  status     text        not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);

alter table gallery_submissions enable row level security;

-- Anon can submit photos
create policy "anon_insert_gallery_submissions"
  on gallery_submissions for insert to anon
  with check (true);

-- Anon can only read approved photos (for public gallery display)
create policy "anon_select_approved_gallery_submissions"
  on gallery_submissions for select to anon
  using (status = 'approved');

-- Authenticated (admin) can read and update all submissions
create policy "auth_all_gallery_submissions"
  on gallery_submissions for all to authenticated
  using (true)
  with check (true);

-- Storage bucket: gallery-uploads (public read)
insert into storage.buckets (id, name, public)
values ('gallery-uploads', 'gallery-uploads', true)
on conflict (id) do nothing;

-- Anon can upload images to gallery-uploads
create policy "anon_upload_gallery_uploads"
  on storage.objects for insert to anon
  with check (bucket_id = 'gallery-uploads');

-- Public read from gallery-uploads
create policy "public_read_gallery_uploads"
  on storage.objects for select to anon
  using (bucket_id = 'gallery-uploads');

-- Authenticated can manage all files in gallery-uploads
create policy "auth_manage_gallery_uploads"
  on storage.objects for all to authenticated
  using (bucket_id = 'gallery-uploads')
  with check (bucket_id = 'gallery-uploads');
