-- Add missing columns to users table for resident management
-- Run this in Supabase SQL Editor

-- Add all missing columns
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS property_unit_id UUID REFERENCES public.property_units(id),
ADD COLUMN IF NOT EXISTS property_name TEXT,
ADD COLUMN IF NOT EXISTS room_number TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS contract_type TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS passport_number TEXT,
ADD COLUMN IF NOT EXISTS passport_issue_date DATE,
ADD COLUMN IF NOT EXISTS passport_issue_place TEXT,
ADD COLUMN IF NOT EXISTS cohabitants TEXT,
ADD COLUMN IF NOT EXISTS other_info TEXT;

-- Add comments
COMMENT ON COLUMN public.users.property_unit_id IS 'Foreign key to property_units table';
COMMENT ON COLUMN public.users.property_name IS 'Property name for display';
COMMENT ON COLUMN public.users.room_number IS 'Room/unit number (e.g., A101, B205)';
COMMENT ON COLUMN public.users.gender IS 'Gender: Male, Female, Other';
COMMENT ON COLUMN public.users.contract_type IS 'Contract type: Owner, Renter, Lease, Short-term';
COMMENT ON COLUMN public.users.phone_number IS 'Contact phone number';
COMMENT ON COLUMN public.users.nationality IS 'Nationality/citizenship';
COMMENT ON COLUMN public.users.passport_number IS 'Passport number for foreign residents';
COMMENT ON COLUMN public.users.passport_issue_date IS 'Passport issue date';
COMMENT ON COLUMN public.users.passport_issue_place IS 'Passport issue place';
COMMENT ON COLUMN public.users.cohabitants IS 'Information about people living together';
COMMENT ON COLUMN public.users.other_info IS 'Additional information';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_property_unit_id ON public.users(property_unit_id);
CREATE INDEX IF NOT EXISTS idx_users_room_number ON public.users(room_number);
CREATE INDEX IF NOT EXISTS idx_users_gender ON public.users(gender);
CREATE INDEX IF NOT EXISTS idx_users_contract_type ON public.users(contract_type);
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON public.users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_nationality ON public.users(nationality);

-- ============================================
-- SHORT CODE: User-friendly 12-character ID
-- ============================================

-- Create function to generate short IDs
CREATE OR REPLACE FUNCTION generate_short_id(length INT DEFAULT 12)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_short_id IS 'Generate a random short ID with specified length (default 12 chars)';

-- Add short_code column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS short_code TEXT UNIQUE;

COMMENT ON COLUMN public.users.short_code IS 'User-friendly short code for display and sharing (12 chars)';

-- Create index on short_code
CREATE INDEX IF NOT EXISTS idx_users_short_code ON public.users(short_code);

-- Generate short codes for existing users
UPDATE public.users 
SET short_code = generate_short_id(12)
WHERE short_code IS NULL;

-- Set default for new users
ALTER TABLE public.users 
ALTER COLUMN short_code SET DEFAULT generate_short_id(12);

-- ============================================

-- Verify the changes
SELECT column_name, data_type, is_nullable, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'users' 
AND table_schema = 'public'
AND column_name IN ('id', 'short_code', 'property_unit_id', 'property_name', 'room_number', 'gender', 'contract_type', 'phone_number', 'nationality', 'passport_number', 'full_name')
ORDER BY column_name;

-- Show sample short codes
SELECT id, email, short_code, room_number, nationality
FROM public.users 
LIMIT 10;
