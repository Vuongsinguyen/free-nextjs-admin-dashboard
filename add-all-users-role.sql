-- Add all_users role and assign menu items
-- Run this after the main migration

-- Insert all_users role if it doesn't exist
INSERT INTO public.roles (name, description) VALUES
  ('all_users', 'All users with basic access')
ON CONFLICT (name) DO NOTHING;

-- Assign menu items to all_users role (same as user/resident)
INSERT INTO public.role_menu_items (role_id, menu_item_id)
SELECT r.id, m.id
FROM public.roles r
CROSS JOIN public.menu_items m
WHERE r.name = 'all_users'
  AND m.name_key IN ('nav.resident', 'nav.allEvents', 'nav.announcements', 'nav.allVouchers', 'nav.busTickets')
  AND m.menu_group = 'main'
ON CONFLICT (role_id, menu_item_id) DO NOTHING;

-- Verify the assignment
SELECT 
  r.name as role_name,
  m.name_key,
  m.path
FROM public.roles r
JOIN public.role_menu_items rm ON r.id = rm.role_id
JOIN public.menu_items m ON rm.menu_item_id = m.id
WHERE r.name = 'all_users'
ORDER BY m.display_order;
