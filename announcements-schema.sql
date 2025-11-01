-- Announcements Management Schema
-- Created: 2025-11-01

-- Drop existing table if exists
DROP TABLE IF EXISTS announcements CASCADE;

-- Create announcements table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT CHECK (category IN ('general', 'maintenance', 'event', 'policy')) DEFAULT 'general',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    author TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT CHECK (status IN ('draft', 'active', 'inactive', 'archived')) DEFAULT 'draft',
    views INTEGER DEFAULT 0 CHECK (views >= 0),
    target_audience TEXT CHECK (target_audience IN ('all', 'residents', 'staff', 'owners')) DEFAULT 'all',
    attachments TEXT[], -- Array of file URLs/paths
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_category ON announcements(category);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_publish_date ON announcements(publish_date);
CREATE INDEX idx_announcements_expiry_date ON announcements(expiry_date);
CREATE INDEX idx_announcements_target_audience ON announcements(target_audience);
CREATE INDEX idx_announcements_is_pinned ON announcements(is_pinned);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_announcements_updated_at();

-- Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (full access)
CREATE POLICY "Allow authenticated users to read announcements"
    ON announcements FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert announcements"
    ON announcements FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update announcements"
    ON announcements FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete announcements"
    ON announcements FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for anon users (read active announcements only)
CREATE POLICY "Allow anon users to read active announcements"
    ON announcements FOR SELECT
    TO anon
    USING (status = 'active' AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE));

-- Insert sample data
INSERT INTO announcements (
    title,
    content,
    category,
    priority,
    publish_date,
    expiry_date,
    author,
    department,
    status,
    views,
    target_audience,
    is_pinned
) VALUES 
(
    'Water Supply Interruption - November 10th',
    'Water supply will be temporarily interrupted on November 10th from 8:00 AM to 2:00 PM for essential maintenance work. Please store sufficient water in advance. We apologize for any inconvenience caused.',
    'maintenance',
    'high',
    '2025-10-28',
    '2025-11-10',
    'John Smith',
    'Maintenance',
    'active',
    234,
    'all',
    true
),
(
    'New Security Measures',
    'Starting November 1st, all residents must use access cards for entry. Physical keys will be phased out by November 15th. Please collect your access card from the management office.',
    'policy',
    'urgent',
    '2025-10-25',
    NULL,
    'Sarah Johnson',
    'Security',
    'active',
    567,
    'all',
    true
),
(
    'Lunar New Year Celebration',
    'Join us for a special Lunar New Year celebration on November 15th at 5:00 PM in the community hall. Traditional performances, dinner, and games for all ages. RSVP required.',
    'event',
    'medium',
    '2025-10-27',
    '2025-11-15',
    'David Lee',
    'Community',
    'active',
    189,
    'residents',
    false
),
(
    'Elevator Maintenance Schedule',
    'Elevator A will undergo routine maintenance every Monday from 9:00 AM to 11:00 AM. Please use Elevator B during this time.',
    'maintenance',
    'medium',
    '2025-10-20',
    NULL,
    'Mike Chen',
    'Maintenance',
    'active',
    445,
    'all',
    false
),
(
    'Parking Policy Update',
    'New parking regulations will be implemented starting December 1st. Each unit is allocated 2 parking spaces. Additional spaces available on first-come-first-served basis.',
    'policy',
    'high',
    '2025-10-22',
    '2025-12-01',
    'Lisa Wang',
    'Management',
    'active',
    312,
    'owners',
    true
),
(
    'Community Yoga Classes',
    'Free yoga classes every Saturday at 7:00 AM in the garden area. All skill levels welcome. Bring your own mat.',
    'event',
    'low',
    '2025-10-15',
    '2025-12-31',
    'Emma Brown',
    'Community',
    'active',
    156,
    'residents',
    false
),
(
    'Fire Safety Drill - November 5th',
    'A fire safety drill will be conducted on November 5th at 10:00 AM. All residents must participate. Assembly point is the main parking lot.',
    'general',
    'urgent',
    '2025-10-30',
    '2025-11-05',
    'Robert Martinez',
    'Security',
    'active',
    678,
    'all',
    true
),
(
    'Swimming Pool Closure',
    'The swimming pool will be closed from November 12-14 for deep cleaning and filter replacement. We apologize for the inconvenience.',
    'maintenance',
    'medium',
    '2025-11-01',
    '2025-11-14',
    'John Smith',
    'Maintenance',
    'active',
    89,
    'all',
    false
),
(
    'Holiday Waste Collection Schedule',
    'Waste collection schedule will be adjusted during the holiday period. Collection will be on Tuesday and Friday instead of Monday and Thursday.',
    'general',
    'medium',
    '2025-10-18',
    '2025-12-15',
    'Amy Nguyen',
    'Operations',
    'active',
    234,
    'all',
    false
),
(
    'Monthly Residents Meeting',
    'The monthly residents meeting will be held on November 20th at 7:00 PM in the community hall. Agenda includes budget review and upcoming projects.',
    'event',
    'medium',
    '2025-11-05',
    '2025-11-20',
    'David Lee',
    'Community',
    'active',
    123,
    'residents',
    false
);

-- Grant permissions
GRANT ALL ON announcements TO authenticated;
GRANT SELECT ON announcements TO anon;
