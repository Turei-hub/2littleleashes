-- Add payment columns to bookings
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'none'
    CHECK (payment_status IN ('none', 'uploaded', 'verified')),
  ADD COLUMN IF NOT EXISTS payment_screenshot_url TEXT,
  ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- Create payment-screenshots storage bucket (public for MVP)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload to the bucket (anon users submitting booking form)
CREATE POLICY "Anyone can upload payment screenshots"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-screenshots');
