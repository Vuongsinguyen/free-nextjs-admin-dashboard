-- Create Admin Test User
-- This creates a test admin account for testing the menu system

-- First, you need to create the user in Supabase Auth
-- Then run this to update their role in the users table

-- Option 1: If you already have a user, update their role to admin
-- Replace 'your-email@example.com' with your actual email
UPDATE public.users 
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- Option 2: Check what users exist and their current roles
SELECT 
  id,
  email,
  role,
  name,
  created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;

-- Option 3: Set a specific user to admin by ID
-- UPDATE public.users 
-- SET role = 'admin'
-- WHERE id = 'user-uuid-here';

-- Verify the admin user
SELECT 
  u.email,
  u.role,
  r.name as role_from_table
FROM public.users u
LEFT JOIN public.roles r ON r.name = u.role
WHERE u.role = 'admin';
