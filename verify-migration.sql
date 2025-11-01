-- Verify Migration Script
-- Run this in Supabase SQL Editor to verify the migration was successful

-- 1. Check menu_items table exists and has data
SELECT 'menu_items table' as check_name, COUNT(*) as count FROM public.menu_items;

-- 2. Check role_menu_items table exists and has data
SELECT 'role_menu_items table' as check_name, COUNT(*) as count FROM public.role_menu_items;

-- 3. Check roles exist
SELECT 'roles' as check_name, name FROM public.roles ORDER BY name;

-- 4. View all menu items by group
SELECT 
  menu_group,
  name_key,
  icon,
  path,
  display_order,
  CASE WHEN parent_id IS NULL THEN 'Parent Menu' ELSE 'Sub Menu' END as menu_type
FROM public.menu_items
ORDER BY menu_group, display_order;

-- 5. Check admin role has all menus
SELECT 
  r.name as role_name,
  COUNT(DISTINCT rm.menu_item_id) as menu_count
FROM public.roles r
LEFT JOIN public.role_menu_items rm ON r.id = rm.role_id
GROUP BY r.name
ORDER BY r.name;

-- 6. Check which menus are assigned to each role
SELECT 
  r.name as role_name,
  m.name_key,
  m.menu_group,
  m.path
FROM public.roles r
JOIN public.role_menu_items rm ON r.id = rm.role_id
JOIN public.menu_items m ON rm.menu_item_id = m.id
WHERE m.parent_id IS NULL  -- Only show parent menus
ORDER BY r.name, m.menu_group, m.display_order;
