-- Bus Ticket Types Management Schema
-- Created: 2025-11-01

-- Drop existing table if exists
DROP TABLE IF EXISTS bus_ticket_types CASCADE;

-- Create bus_ticket_types table
CREATE TABLE bus_ticket_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_name TEXT NOT NULL,
    ticket_code TEXT NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    validity INTEGER NOT NULL CHECK (validity > 0), -- days
    routes TEXT[] DEFAULT '{}', -- Array of route names
    bus_type TEXT CHECK (bus_type IN ('Express', 'Standard', 'VIP')) DEFAULT 'Standard',
    max_usage_per_day INTEGER DEFAULT 1 CHECK (max_usage_per_day > 0),
    available_time_slots TEXT[] DEFAULT '{}', -- Array of time slots like "06:00-09:00"
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    discount NUMERIC DEFAULT 0 CHECK (discount >= 0 AND discount <= 100), -- percentage
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX idx_bus_ticket_types_code ON bus_ticket_types(ticket_code);
CREATE INDEX idx_bus_ticket_types_status ON bus_ticket_types(status);
CREATE INDEX idx_bus_ticket_types_bus_type ON bus_ticket_types(bus_type);
CREATE INDEX idx_bus_ticket_types_price ON bus_ticket_types(price);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_bus_ticket_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bus_ticket_types_updated_at
    BEFORE UPDATE ON bus_ticket_types
    FOR EACH ROW
    EXECUTE FUNCTION update_bus_ticket_types_updated_at();

-- Enable Row Level Security
ALTER TABLE bus_ticket_types ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read bus_ticket_types"
    ON bus_ticket_types FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert bus_ticket_types"
    ON bus_ticket_types FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update bus_ticket_types"
    ON bus_ticket_types FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete bus_ticket_types"
    ON bus_ticket_types FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for anon users (read-only)
CREATE POLICY "Allow anon users to read active bus_ticket_types"
    ON bus_ticket_types FOR SELECT
    TO anon
    USING (status = 'active');

-- Insert sample data
INSERT INTO bus_ticket_types (
    ticket_name,
    ticket_code,
    description,
    price,
    validity,
    routes,
    bus_type,
    max_usage_per_day,
    available_time_slots,
    status,
    discount
) VALUES 
(
    'Monthly Pass - Express',
    'MP-EXP-001',
    'Unlimited express bus rides for 30 days',
    500000,
    30,
    ARRAY['District 1 - District 7', 'District 2 - District 9', 'Thu Duc - District 1'],
    'Express',
    10,
    ARRAY['06:00-09:00', '16:00-19:00'],
    'active',
    0
),
(
    'Weekly Pass - Standard',
    'WP-STD-002',
    'Unlimited standard bus rides for 7 days',
    150000,
    7,
    ARRAY['District 3 - Binh Thanh', 'District 5 - Tan Binh', 'District 10 - Go Vap'],
    'Standard',
    8,
    ARRAY['05:00-22:00'],
    'active',
    10
),
(
    'VIP Monthly Pass',
    'MP-VIP-003',
    'Premium VIP bus service with luxury amenities for 30 days',
    1200000,
    30,
    ARRAY['All Routes'],
    'VIP',
    15,
    ARRAY['24/7'],
    'active',
    15
),
(
    'Single Trip - Express',
    'ST-EXP-004',
    'One-way express bus ticket',
    25000,
    1,
    ARRAY['District 1 - District 7', 'District 2 - District 9'],
    'Express',
    1,
    ARRAY['06:00-20:00'],
    'active',
    0
),
(
    'Student Pass - Standard',
    'SP-STD-005',
    'Discounted monthly pass for students',
    200000,
    30,
    ARRAY['All Standard Routes'],
    'Standard',
    12,
    ARRAY['05:00-23:00'],
    'active',
    40
),
(
    'Weekend Pass - VIP',
    'WP-VIP-006',
    'VIP bus service for weekends only',
    300000,
    2,
    ARRAY['All VIP Routes'],
    'VIP',
    20,
    ARRAY['24/7'],
    'active',
    5
),
(
    'Daily Pass - Standard',
    'DP-STD-007',
    'Unlimited standard bus rides for one day',
    50000,
    1,
    ARRAY['All Standard Routes'],
    'Standard',
    15,
    ARRAY['05:00-23:00'],
    'active',
    0
),
(
    'Senior Citizen Pass',
    'SC-STD-008',
    'Discounted monthly pass for senior citizens',
    180000,
    30,
    ARRAY['All Standard Routes'],
    'Standard',
    10,
    ARRAY['06:00-20:00'],
    'active',
    50
);

-- Grant permissions
GRANT ALL ON bus_ticket_types TO authenticated;
GRANT SELECT ON bus_ticket_types TO anon;
