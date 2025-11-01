-- Create facility_bookings table
CREATE TABLE IF NOT EXISTS facility_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed', 'in-progress')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('paid', 'unpaid', 'refunded')),
  attendees INTEGER,
  purpose TEXT,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_facility_bookings_facility_id ON facility_bookings(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_bookings_user_id ON facility_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_facility_bookings_booking_date ON facility_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_facility_bookings_status ON facility_bookings(status);
CREATE INDEX IF NOT EXISTS idx_facility_bookings_created_at ON facility_bookings(created_at);

-- Enable Row Level Security
ALTER TABLE facility_bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON facility_bookings;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON facility_bookings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON facility_bookings;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON facility_bookings;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON facility_bookings
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON facility_bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON facility_bookings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON facility_bookings
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_facility_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER trigger_update_facility_bookings_updated_at
  BEFORE UPDATE ON facility_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_facility_bookings_updated_at();

-- Insert sample data
INSERT INTO facility_bookings (
  booking_code,
  facility_id,
  user_name,
  user_email,
  user_phone,
  booking_date,
  start_time,
  end_time,
  duration,
  total_price,
  status,
  payment_status,
  attendees,
  purpose,
  special_requests
) VALUES
  (
    'BK2025100001',
    (SELECT id FROM facilities WHERE name LIKE '%Pool%' LIMIT 1),
    'Nguyen Van A',
    'nguyenvana@example.com',
    '0901234567',
    '2025-11-05',
    '08:00',
    '10:00',
    2,
    300000,
    'confirmed',
    'paid',
    15,
    'Swimming lessons for kids',
    'Need 2 lifeguards'
  ),
  (
    'BK2025100002',
    (SELECT id FROM facilities WHERE name LIKE '%Gym%' LIMIT 1),
    'Tran Thi B',
    'tranthib@example.com',
    '0912345678',
    '2025-11-06',
    '14:00',
    '16:00',
    2,
    200000,
    'pending',
    'unpaid',
    1,
    'Personal training session',
    NULL
  ),
  (
    'BK2025100003',
    (SELECT id FROM facilities WHERE name LIKE '%Tennis%' LIMIT 1),
    'Le Van C',
    'levanc@example.com',
    '0923456789',
    '2025-11-08',
    '10:00',
    '12:00',
    2,
    250000,
    'confirmed',
    'paid',
    4,
    'Tennis tournament practice',
    'Need extra tennis balls'
  );

COMMENT ON TABLE facility_bookings IS 'Stores facility booking information';
COMMENT ON COLUMN facility_bookings.booking_code IS 'Unique booking code';
COMMENT ON COLUMN facility_bookings.facility_id IS 'Reference to facilities table';
COMMENT ON COLUMN facility_bookings.user_id IS 'Reference to users table (optional)';
COMMENT ON COLUMN facility_bookings.status IS 'Booking status: confirmed, pending, cancelled, completed, in-progress';
COMMENT ON COLUMN facility_bookings.payment_status IS 'Payment status: paid, unpaid, refunded';
