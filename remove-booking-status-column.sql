-- Migration: Remove status column from facility_bookings table
-- Date: 2025-11-02
-- Description: Remove the status column as it's no longer needed

-- Drop the index on status column
DROP INDEX IF EXISTS idx_facility_bookings_status;

-- Drop the status column
ALTER TABLE facility_bookings DROP COLUMN IF EXISTS status;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'facility_bookings' 
ORDER BY ordinal_position;
