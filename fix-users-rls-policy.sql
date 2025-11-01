-- Fix RLS policy for users table to allow reading residents

-- Check current RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';

-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Drop the policy if it exists, then create it
DROP POLICY IF EXISTS "Authenticated users can view all users" ON public.users;

-- Create policy to allow authenticated users to view all users
CREATE POLICY "Authenticated users can view all users" 
ON public.users
FOR SELECT 
TO authenticated
USING (true);

-- Alternative: If you want users to only see residents
-- CREATE POLICY IF NOT EXISTS "Authenticated users can view residents" 
-- ON public.users
-- FOR SELECT 
-- TO authenticated
-- USING (role = 'resident');

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Test query as authenticated user
SELECT COUNT(*) as total_residents
FROM users 
WHERE role = 'resident';
