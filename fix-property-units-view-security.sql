-- Fix view security for public.property_units_full
-- Ensures queries run with the invoking user's privileges and respect base table RLS

ALTER VIEW public.property_units_full
SET (security_invoker = true);

-- Verification (optional):
-- SELECT relname, reloptions
-- FROM pg_class
-- WHERE relname = 'property_units_full';
-- Expect reloptions to include '{security_invoker=true}'
