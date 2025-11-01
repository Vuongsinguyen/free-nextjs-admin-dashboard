-- Events Management Schema
-- Created: 2025-11-01

-- Drop existing table if exists
DROP TABLE IF EXISTS events CASCADE;

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_audience TEXT CHECK (target_audience IN ('all', 'specific_buildings', 'specific_apartments')) DEFAULT 'all',
    target_buildings TEXT[], -- Array of building IDs/names
    target_apartments TEXT[], -- Array of apartment IDs/numbers
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    shop_name TEXT,
    shop_type TEXT CHECK (shop_type IN ('in_building', 'external')),
    text_content TEXT NOT NULL,
    pdf_files TEXT[], -- Array of PDF file URLs
    image_files TEXT[], -- Array of image URLs
    status TEXT CHECK (status IN ('active', 'scheduled', 'expired', 'draft')) DEFAULT 'draft',
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_target_audience ON events(target_audience);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_end_date ON events(end_date);
CREATE INDEX idx_events_created_by ON events(created_by);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_events_updated_at();

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (full access)
CREATE POLICY "Allow authenticated users to read events"
    ON events FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert events"
    ON events FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update events"
    ON events FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete events"
    ON events FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for anon users (read active/scheduled events only)
CREATE POLICY "Allow anon users to read active events"
    ON events FOR SELECT
    TO anon
    USING (status IN ('active', 'scheduled') AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

-- Insert sample data
INSERT INTO events (
    title,
    description,
    target_audience,
    start_date,
    end_date,
    text_content,
    status,
    created_by,
    created_at
) VALUES 
(
    'Monthly Residents Meeting',
    'Discussion about building maintenance and upcoming improvements',
    'all',
    '2025-11-05',
    '2025-11-05',
    'Discussion about building maintenance and upcoming improvements. Location: Community Hall - Floor 1, Time: 18:00',
    'scheduled',
    'Building Management',
    '2025-10-25 10:00:00+00'
),
(
    'Fire Safety Drill',
    'Mandatory fire safety drill and evacuation practice',
    'all',
    '2025-11-10',
    '2025-11-10',
    'Mandatory fire safety drill and evacuation practice. Location: All Building Areas, Time: 10:00',
    'scheduled',
    'Safety Department',
    '2025-10-26 09:00:00+00'
),
(
    'Elevator Maintenance',
    'Scheduled maintenance for elevators A & B',
    'all',
    '2025-11-12',
    '2025-11-12',
    'Scheduled maintenance for elevators A & B. Time: 08:00',
    'scheduled',
    'Maintenance Team',
    '2025-10-27 08:30:00+00'
),
(
    'Lunar New Year Celebration',
    'Community celebration with food and entertainment',
    'all',
    '2025-11-15',
    '2025-11-15',
    'Community celebration with food and entertainment. Location: Rooftop Garden, Time: 17:00',
    'scheduled',
    'Residents Committee',
    '2025-10-28 11:00:00+00'
),
(
    'Swimming Pool Cleaning',
    'Deep cleaning and chemical treatment of swimming pool',
    'all',
    '2025-10-25',
    '2025-10-25',
    'Deep cleaning and chemical treatment of swimming pool. Time: 06:00',
    'expired',
    'Maintenance Team',
    '2025-10-20 14:00:00+00'
),
(
    'Building Security Update',
    'Information session about new security measures',
    'all',
    '2025-10-28',
    '2025-10-28',
    'Information session about new security measures. Location: Meeting Room B, Time: 19:00',
    'active',
    'Security Department',
    '2025-10-24 16:00:00+00'
),
(
    'Yoga Class for Residents',
    'Weekly yoga session for all residents',
    'all',
    '2025-11-01',
    '2025-11-01',
    'Weekly yoga session for all residents. Location: Gym - Floor 5, Time: 06:30',
    'active',
    'Fitness Center',
    '2025-10-22 12:00:00+00'
),
(
    'Garden Renovation Notice',
    'Garden area will be closed for renovation',
    'all',
    '2025-11-20',
    '2025-11-25',
    'Garden area will be closed for renovation. Duration: 5 days',
    'scheduled',
    'Landscaping Team',
    '2025-10-29 10:30:00+00'
),
(
    'Children''s Art Workshop',
    'Art and craft session for children aged 5-12',
    'all',
    '2025-11-08',
    '2025-11-08',
    'Art and craft session for children aged 5-12. Location: Activity Room, Time: 14:00',
    'scheduled',
    'Community Center',
    '2025-10-30 13:00:00+00'
),
(
    'Water Tank Inspection',
    'Annual water tank cleaning and inspection',
    'all',
    '2025-10-20',
    '2025-10-20',
    'Annual water tank cleaning and inspection. Water supply may be interrupted. Time: 09:00-15:00',
    'expired',
    'Maintenance Team',
    '2025-10-15 08:00:00+00'
);

-- Grant permissions
GRANT ALL ON events TO authenticated;
GRANT SELECT ON events TO anon;
