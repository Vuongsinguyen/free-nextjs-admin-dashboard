-- OPTIONAL: Migrate users table to use shorter IDs (12 characters)
-- ⚠️ WARNING: This is a significant change that affects all references to users
-- Only run this if you really want to change from UUID to short IDs

-- Step 1: Create a function to generate short IDs
CREATE OR REPLACE FUNCTION generate_short_id(length INT DEFAULT 12)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Step 2: Show current schema
SELECT 
  table_name,
  column_name,
  data_type,
  character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
AND column_name = 'id';

-- Step 3: Check foreign key constraints
SELECT
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND ccu.table_name = 'users'
AND ccu.column_name = 'id';

-- ⚠️ MANUAL STEPS REQUIRED (Run in Supabase SQL Editor if you want short IDs):
-- 
-- 1. Backup your database first!
-- 2. Drop all foreign key constraints that reference users.id
-- 3. Create a new column users.short_id TEXT
-- 4. Generate short IDs for existing users
-- 5. Update all tables that reference users.id to use short_id
-- 6. Drop the old id column
-- 7. Rename short_id to id
-- 8. Recreate foreign key constraints
-- 
-- Example (DO NOT RUN without testing):
-- ALTER TABLE public.users ADD COLUMN short_id TEXT UNIQUE;
-- UPDATE public.users SET short_id = generate_short_id(12);
-- -- Update all foreign keys...
-- -- ALTER TABLE other_table DROP CONSTRAINT fk_user_id;
-- -- ALTER TABLE other_table ALTER COLUMN user_id TYPE TEXT;
-- -- UPDATE other_table SET user_id = users.short_id FROM users WHERE other_table.user_id::text = users.id::text;
-- -- ALTER TABLE public.users DROP COLUMN id;
-- -- ALTER TABLE public.users RENAME COLUMN short_id TO id;
-- -- ALTER TABLE public.users ALTER COLUMN id SET DEFAULT generate_short_id(12);
-- -- Recreate foreign keys...

COMMENT ON FUNCTION generate_short_id IS 'Generate a random short ID with specified length (default 12 chars)';

-- Test the function
SELECT generate_short_id(12) as sample_short_id_1,
       generate_short_id(12) as sample_short_id_2,
       generate_short_id(12) as sample_short_id_3;

-- 📝 RECOMMENDATION:
-- For production systems, it's better to keep UUID for id column (good for distributed systems)
-- and add a separate short_code or display_id column for user-friendly IDs if needed.
-- This way you get benefits of both:
-- - UUID: Globally unique, no collisions, good for databases
-- - Short code: Easy to read/type, good for display/sharing

-- Alternative approach (RECOMMENDED):
-- Add a short display code instead of changing the ID
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS short_code TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_users_short_code ON public.users(short_code);

-- Generate short codes for existing users
UPDATE public.users 
SET short_code = generate_short_id(12)
WHERE short_code IS NULL;

-- Add default for new users
ALTER TABLE public.users 
ALTER COLUMN short_code SET DEFAULT generate_short_id(12);

COMMENT ON COLUMN public.users.short_code IS 'User-friendly short code for display (12 chars)';

-- Verify
SELECT id, email, short_code FROM public.users LIMIT 5;
