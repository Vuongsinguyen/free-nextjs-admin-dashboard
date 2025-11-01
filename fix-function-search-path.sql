-- Fix function search_path security issue
-- Ensures all functions use a fixed search_path to prevent search_path hijacking attacks

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SET search_path = '';

-- Fix update_events_updated_at function
CREATE OR REPLACE FUNCTION public.update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Fix update_announcements_updated_at function
CREATE OR REPLACE FUNCTION public.update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Fix update_invoices_updated_at function
CREATE OR REPLACE FUNCTION public.update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Fix update_bus_ticket_types_updated_at function
CREATE OR REPLACE FUNCTION public.update_bus_ticket_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Fix generate_short_id function
CREATE OR REPLACE FUNCTION public.generate_short_id(length INT DEFAULT 12)
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

-- Verification (optional):
-- SELECT proname, proconfig
-- FROM pg_proc
-- WHERE proname IN ('update_updated_at_column', 'update_events_updated_at', 
--                   'update_announcements_updated_at', 'update_invoices_updated_at',
--                   'update_bus_ticket_types_updated_at', 'generate_short_id');
-- Expect proconfig to show {search_path=} for all functions
