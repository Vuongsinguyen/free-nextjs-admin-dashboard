# Fix Events Row-Level Security (RLS) Policy

## Problem
Error when saving events: **"new row violates row-level security policy"**

This happens because the `events` table has Row-Level Security (RLS) enabled in Supabase, but there are no policies allowing INSERT/UPDATE operations.

## Solution

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the SQL Script
Copy and paste the contents of `fix-events-rls-policy.sql` into the SQL editor and click **Run**.

Or copy this directly:

```sql
-- Fix Row-Level Security policies for events table

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
```

### Step 3: Verify
After running the script, you should see a success message. The policies are now in place.

### Step 4: Test
1. Go back to your app: http://localhost:3000/events
2. Click **+ Create Event**
3. Fill in the form
4. Click **Create Event**
5. The event should now save successfully! ✅

## What These Policies Do

- **SELECT (Read)**: Anyone can view events (including unauthenticated users)
- **INSERT (Create)**: Only authenticated users can create events
- **UPDATE (Edit)**: Only authenticated users can update events
- **DELETE**: Only authenticated users can delete events

## Alternative: More Restrictive Policies

If you want only specific users (e.g., admins) to manage events, you can modify the policies to check user roles. For example:

```sql
-- Only allow users with specific email domains or roles
CREATE POLICY "Enable insert for admins only" ON events
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('Admin', 'Building Owner')
  )
);
```

## Troubleshooting

If you still get errors:

1. **Check if you're logged in**: The policies require `auth.uid()` to be present
2. **Check user authentication**: Make sure you're logged in to the app
3. **Check RLS is enabled**: Run `SELECT * FROM pg_tables WHERE tablename = 'events'` and verify `rowsecurity = true`
4. **View current policies**: 
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'events';
   ```

## References
- [Supabase Row Level Security Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
