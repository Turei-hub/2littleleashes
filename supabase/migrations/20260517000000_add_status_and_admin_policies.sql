-- Add status column to bookings
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'confirmed', 'cancelled'));

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public booking form: anon users can insert
DROP POLICY IF EXISTS "Anyone can submit bookings" ON bookings;
CREATE POLICY "Anyone can submit bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin: read all bookings
DROP POLICY IF EXISTS "Admin can read all bookings" ON bookings;
CREATE POLICY "Admin can read all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

-- Admin: update booking status
DROP POLICY IF EXISTS "Admin can update bookings" ON bookings;
CREATE POLICY "Admin can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
