-- Temporary fix: Disable RLS for events bucket (NOT RECOMMENDED FOR PRODUCTION)
-- This allows anyone to upload/read/delete files in the events bucket

-- Option 1: Make the bucket public (easier but less secure)
-- Go to Storage -> events bucket -> Configuration -> Make public

-- Option 2: Create permissive policies via SQL
-- Run this in SQL Editor:

-- Drop any existing restrictive policies first
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;

-- Create very permissive policies (CAUTION: Use only for development)
CREATE POLICY "Allow all operations on events bucket"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'events')
WITH CHECK (bucket_id = 'events');

-- Verify
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND (qual LIKE '%events%' OR with_check LIKE '%events%');
