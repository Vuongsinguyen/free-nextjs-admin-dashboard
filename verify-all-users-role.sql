-- Verify and add all_users role

-- Check if all_users role exists
SELECT * FROM roles WHERE name = 'all_users';

-- If not exists, insert it
INSERT INTO roles (id, name, description)
VALUES (
  gen_random_uuid(),
  'all_users',
  'Default role for all authenticated users'
)
ON CONFLICT (name) DO NOTHING;

-- Verify the role now exists
SELECT * FROM roles WHERE name = 'all_users';

-- Count how many menus are assigned to all_users role
SELECT COUNT(*) as menu_count 
FROM role_menu_items rmi
JOIN roles r ON r.id = rmi.role_id
WHERE r.name = 'all_users';

-- If count is 0, assign all menus to all_users
-- Get the role_id first
DO $$
DECLARE
  v_role_id UUID;
BEGIN
  SELECT id INTO v_role_id FROM roles WHERE name = 'all_users';
  
  IF v_role_id IS NOT NULL THEN
    -- Insert all menu items for all_users role
    INSERT INTO role_menu_items (role_id, menu_item_id)
    SELECT v_role_id, m.id
    FROM menu_items m
    WHERE NOT EXISTS (
      SELECT 1 FROM role_menu_items 
      WHERE role_id = v_role_id AND menu_item_id = m.id
    );
    
    RAISE NOTICE 'Assigned % menus to all_users role', (SELECT COUNT(*) FROM role_menu_items WHERE role_id = v_role_id);
  ELSE
    RAISE NOTICE 'all_users role not found!';
  END IF;
END $$;

-- Final verification
SELECT 
  r.name as role_name,
  COUNT(rmi.menu_item_id) as menu_count
FROM roles r
LEFT JOIN role_menu_items rmi ON r.id = rmi.role_id
WHERE r.name IN ('admin', 'all_users', 'user', 'resident')
GROUP BY r.name
ORDER BY r.name;
