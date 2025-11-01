-- Fix Row-Level Security policies for Storage bucket 'events'
-- This allows authenticated users to upload, read, update, and delete files

-- IMPORTANT: Run this in Supabase Dashboard -> Storage -> Policies
-- Or in SQL Editor (but Storage policies are usually managed via Dashboard)

-- For bucket 'events', create the following policies:

-- 1. Allow authenticated users to upload files (INSERT)
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'events'
);

-- 2. Allow public read access to files (SELECT)
CREATE POLICY "Allow public to read files"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'events'
);

-- 3. Allow authenticated users to update their own files (UPDATE)
CREATE POLICY "Allow authenticated users to update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'events'
)
WITH CHECK (
  bucket_id = 'events'
);

-- 4. Allow authenticated users to delete their own files (DELETE)
CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'events'
);

-- Verify the storage policies
SELECT *
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects';
