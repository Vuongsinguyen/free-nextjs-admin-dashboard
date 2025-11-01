-- Fix RLS policy for roles table to allow authenticated users to read roles

-- First, check if RLS is enabled on roles table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'roles';

-- Check existing policies on roles table
SELECT * FROM pg_policies WHERE tablename = 'roles';

-- Drop existing policy if it exists (in case we need to recreate)
DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.roles;

-- Create policy to allow authenticated users to read roles
CREATE POLICY "Authenticated users can view roles" 
ON public.roles
FOR SELECT 
TO authenticated
USING (true);

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'roles';

-- Test query (should now work)
SELECT id, name, description FROM roles WHERE name = 'all_users';
