-- Migration to fix infinite recursion in RLS policies
-- Run this in Supabase SQL Editor after the main schema

-- Drop problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage facilities" ON public.facilities;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage permissions" ON public.permissions;
DROP POLICY IF EXISTS "Admins can manage locations" ON public.locations;
DROP POLICY IF EXISTS "Admins can manage buildings" ON public.buildings;
DROP POLICY IF EXISTS "Admins can manage user_buildings" ON public.user_buildings;
DROP POLICY IF EXISTS "Admins can manage shops" ON public.shops;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;

-- Recreate policies without recursion
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage facilities" ON public.facilities
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage permissions" ON public.permissions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage locations" ON public.locations
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage buildings" ON public.buildings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage user_buildings" ON public.user_buildings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage shops" ON public.shops
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage roles" ON public.roles
  FOR ALL USING (auth.role() = 'service_role');

-- Fix function search path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql' SET search_path = '';