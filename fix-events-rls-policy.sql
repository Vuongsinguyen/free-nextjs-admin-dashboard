-- Fix Row-Level Security policies for events table
-- This allows authenticated users to create, read, update, and delete events

-- First, check if RLS is enabled (it is, based on the error)
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON events;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON events;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON events;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON events;

-- Create policies for the events table

-- 1. Allow everyone to read events (public access)
CREATE POLICY "Enable read access for all users" ON events
FOR SELECT
USING (true);

-- 2. Allow authenticated users to insert events
CREATE POLICY "Enable insert for authenticated users only" ON events
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Allow authenticated users to update events
CREATE POLICY "Enable update for authenticated users only" ON events
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Allow authenticated users to delete events
CREATE POLICY "Enable delete for authenticated users only" ON events
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'events';
