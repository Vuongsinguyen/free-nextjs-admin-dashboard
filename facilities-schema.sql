-- Drop existing table if exists (WARNING: This will delete all data!)
DROP TABLE IF EXISTS facilities CASCADE;

-- Create facilities table
CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 0,
  current_occupancy INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'available',
  amenities TEXT[] DEFAULT '{}',
  price_per_hour DECIMAL(10, 2) NOT NULL DEFAULT 0,
  manager VARCHAR(255),
  last_maintenance DATE,
  next_maintenance DATE,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_facilities_category ON facilities(category);
CREATE INDEX IF NOT EXISTS idx_facilities_status ON facilities(status);
CREATE INDEX IF NOT EXISTS idx_facilities_name ON facilities(name);

-- Enable Row Level Security
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;

-- Create policies for facilities table
-- Allow public to read facilities
CREATE POLICY "Allow public read access to facilities"
ON facilities
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert facilities
CREATE POLICY "Allow authenticated users to insert facilities"
ON facilities
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update facilities
CREATE POLICY "Allow authenticated users to update facilities"
ON facilities
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete facilities
CREATE POLICY "Allow authenticated users to delete facilities"
ON facilities
FOR DELETE
TO authenticated
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_facilities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER facilities_updated_at
BEFORE UPDATE ON facilities
FOR EACH ROW
EXECUTE FUNCTION update_facilities_updated_at();

-- Insert sample data
INSERT INTO facilities (name, category, location, capacity, current_occupancy, status, amenities, price_per_hour, manager, last_maintenance, next_maintenance, rating, total_bookings, description) VALUES
('Swimming Pool A', 'Sports & Recreation', 'Building A - Floor 1', 50, 23, 'available', ARRAY['Heated Pool', 'Changing Rooms', 'Showers', 'Lockers'], 150000, 'Nguyen Van A', '2025-10-15', '2025-11-15', 4.5, 234, 'Olympic-size heated swimming pool with changing facilities'),
('Gym & Fitness Center', 'Sports & Recreation', 'Building B - Floor 2', 80, 65, 'occupied', ARRAY['Cardio Equipment', 'Weight Training', 'Personal Trainer', 'Sauna'], 200000, 'Tran Thi B', '2025-10-20', '2025-11-20', 4.8, 567, 'Fully equipped gym with modern fitness equipment and personal training services'),
('Meeting Room 101', 'Meeting & Events', 'Building A - Floor 3', 20, 0, 'available', ARRAY['Projector', 'Whiteboard', 'Video Conference', 'WiFi'], 300000, 'Le Van C', '2025-10-25', '2025-12-25', 4.3, 189, 'Professional meeting room with AV equipment and high-speed internet'),
('Tennis Court 1', 'Sports & Recreation', 'Outdoor - East Wing', 4, 0, 'maintenance', ARRAY['Night Lighting', 'Equipment Rental', 'Seating Area'], 100000, 'Pham Thi D', '2025-10-28', '2025-10-30', 4.2, 145, 'Professional tennis court with night lighting'),
('Conference Hall', 'Meeting & Events', 'Building C - Floor 5', 200, 150, 'occupied', ARRAY['Stage', 'Sound System', 'Projector', 'Catering Service', 'WiFi'], 1000000, 'Hoang Van E', '2025-10-10', '2025-11-10', 4.9, 89, 'Large conference hall for events and seminars'),
('Kids Playground', 'Recreation', 'Outdoor - West Wing', 30, 12, 'available', ARRAY['Slides', 'Swings', 'Climbing Frame', 'Safety Padding', 'Restrooms'], 50000, 'Nguyen Thi F', '2025-10-22', '2025-11-22', 4.6, 312, 'Safe and fun playground for children'),
('Yoga Studio', 'Wellness', 'Building B - Floor 4', 25, 0, 'available', ARRAY['Yoga Mats', 'Meditation Room', 'Changing Rooms', 'Air Conditioning'], 180000, 'Tran Van G', '2025-10-18', '2025-11-18', 4.7, 278, 'Peaceful yoga studio with meditation space'),
('BBQ Area', 'Recreation', 'Outdoor - Rooftop', 40, 0, 'closed', ARRAY['BBQ Grills', 'Tables & Chairs', 'Sink', 'Covered Area'], 250000, 'Le Thi H', '2025-10-05', '2025-11-05', 4.4, 156, 'Rooftop BBQ area perfect for gatherings'),
('Library & Study Room', 'Education', 'Building A - Floor 2', 60, 34, 'available', ARRAY['Books', 'Private Study Rooms', 'WiFi', 'Printing Service', 'Coffee Machine'], 0, 'Pham Van I', '2025-10-12', '2025-11-12', 4.8, 445, 'Quiet study space with extensive book collection'),
('Basketball Court', 'Sports & Recreation', 'Outdoor - North Wing', 10, 8, 'occupied', ARRAY['Night Lighting', 'Scoreboard', 'Seating', 'Water Fountain'], 120000, 'Hoang Thi K', '2025-10-08', '2025-11-08', 4.5, 298, 'Full-size basketball court with night lighting');

-- Verify the table
SELECT COUNT(*) as total_facilities FROM facilities;
