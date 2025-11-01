-- Fix Row-Level Security policies for events table (Version 2)
-- This allows all authenticated users to create, read, update, and delete events
-- Regardless of user_id field

-- Drop existing policies
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
-- Changed from auth.uid() IS NOT NULL to checking if user is authenticated via JWT
CREATE POLICY "Enable insert for authenticated users only" ON events
FOR INSERT
WITH CHECK (
  -- Check if there's a valid JWT token (user is authenticated)
  auth.role() = 'authenticated'
);

-- 3. Allow authenticated users to update events
CREATE POLICY "Enable update for authenticated users only" ON events
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 4. Allow authenticated users to delete events
CREATE POLICY "Enable delete for authenticated users only" ON events
FOR DELETE
USING (auth.role() = 'authenticated');

-- Verify the policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies
WHERE tablename = 'events';

-- Also check if RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity
FROM pg_tables
WHERE tablename = 'events';
