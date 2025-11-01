-- Alternative: Add missing columns to existing facilities table
-- Use this if you want to keep existing data

-- Add category column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'facilities' AND column_name = 'category'
  ) THEN
    ALTER TABLE facilities ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT 'Other';
  END IF;
END $$;

-- Add other missing columns if needed
DO $$ 
BEGIN
  -- Add amenities if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'facilities' AND column_name = 'amenities'
  ) THEN
    ALTER TABLE facilities ADD COLUMN amenities TEXT[] DEFAULT '{}';
  END IF;

  -- Add price_per_hour if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'facilities' AND column_name = 'price_per_hour'
  ) THEN
    ALTER TABLE facilities ADD COLUMN price_per_hour DECIMAL(10, 2) NOT NULL DEFAULT 0;
  END IF;

  -- Add manager if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'facilities' AND column_name = 'manager'
  ) THEN
    ALTER TABLE facilities ADD COLUMN manager VARCHAR(255);
  END IF;

  -- Add last_maintenance if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'facilities' AND column_name = 'last_maintenance'
  ) THEN
    ALTER TABLE facilities ADD COLUMN last_maintenance DATE;
  END IF;

  -- Add next_maintenance if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'facilities' AND column_name = 'next_maintenance'
  ) THEN
    ALTER TABLE facilities ADD COLUMN next_maintenance DATE;
  END IF;

  -- Add rating if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'facilities' AND column_name = 'rating'
  ) THEN
    ALTER TABLE facilities ADD COLUMN rating DECIMAL(3, 2) DEFAULT 0;
  END IF;

  -- Add total_bookings if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'facilities' AND column_name = 'total_bookings'
  ) THEN
    ALTER TABLE facilities ADD COLUMN total_bookings INTEGER DEFAULT 0;
  END IF;

  -- Add current_occupancy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'facilities' AND column_name = 'current_occupancy'
  ) THEN
    ALTER TABLE facilities ADD COLUMN current_occupancy INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Verify columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'facilities' 
ORDER BY ordinal_position;
