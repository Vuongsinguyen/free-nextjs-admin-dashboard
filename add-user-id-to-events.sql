-- Add user_id column to events table to track who created/modified the event

-- 1. Add user_id column (nullable for existing records)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

-- 3. Update RLS policies to use user_id

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON events;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON events;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON events;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON events;

-- Create new policies

-- 1. Allow everyone to read events
CREATE POLICY "Enable read access for all users" ON events
FOR SELECT
USING (true);

-- 2. Allow authenticated users to insert events with their user_id
CREATE POLICY "Enable insert for authenticated users only" ON events
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  (user_id = auth.uid() OR user_id IS NULL)
);

-- 3. Allow users to update their own events (or any event if user_id is null)
CREATE POLICY "Enable update for authenticated users only" ON events
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  (user_id = auth.uid() OR user_id IS NULL)
)
WITH CHECK (
  auth.uid() IS NOT NULL AND
  (user_id = auth.uid() OR user_id IS NULL)
);

-- 4. Allow users to delete their own events (or any event if user_id is null)
CREATE POLICY "Enable delete for authenticated users only" ON events
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND
  (user_id = auth.uid() OR user_id IS NULL)
);

-- Verify
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'events';
