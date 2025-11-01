-- Menu System Migration
-- This creates the dynamic menu management system

-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_key TEXT NOT NULL, -- Translation key (e.g., "nav.residents")
  icon TEXT, -- Icon name (e.g., "UserCircleIcon")
  path TEXT, -- Route path (e.g., "/residents")
  parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE, -- For sub-menu items
  menu_group TEXT NOT NULL DEFAULT 'main', -- 'main', 'masterData', 'systemConfig'
  display_order INTEGER NOT NULL DEFAULT 0, -- Order in the menu
  is_active BOOLEAN DEFAULT true,
  is_pro BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create role_menu_items junction table
CREATE TABLE IF NOT EXISTS public.role_menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(role_id, menu_item_id)
);

-- Enable Row Level Security
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_items table
CREATE POLICY "Anyone can view active menu items" ON public.menu_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage menu items" ON public.menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create policies for role_menu_items table
CREATE POLICY "Anyone can view role menu mappings" ON public.role_menu_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage role menu mappings" ON public.role_menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX idx_menu_items_parent_id ON public.menu_items(parent_id);
CREATE INDEX idx_menu_items_menu_group ON public.menu_items(menu_group);
CREATE INDEX idx_menu_items_display_order ON public.menu_items(display_order);
CREATE INDEX idx_menu_items_is_active ON public.menu_items(is_active);
CREATE INDEX idx_role_menu_items_role_id ON public.role_menu_items(role_id);
CREATE INDEX idx_role_menu_items_menu_item_id ON public.role_menu_items(menu_item_id);

-- Add trigger for updated_at
CREATE TRIGGER update_menu_items_updated_at 
  BEFORE UPDATE ON public.menu_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default roles if they don't exist
INSERT INTO public.roles (name, description) VALUES
  ('admin', 'Administrator with full access'),
  ('user', 'Regular user with limited access'),
  ('resident', 'Resident user'),
  ('all_users', 'All users with basic access')
ON CONFLICT (name) DO NOTHING;

-- Insert menu items for QUICK ACCESS (main menu)
INSERT INTO public.menu_items (name_key, icon, path, menu_group, display_order) VALUES
  ('nav.resident', 'UserCircleIcon', '/residents', 'main', 1),
  ('nav.allInvoices', 'TableIcon', '/invoices', 'main', 2),
  ('nav.allEvents', 'CalenderIcon', '/events', 'main', 3),
  ('nav.announcements', 'CalenderIcon', '/allannouncements', 'main', 4),
  ('nav.allVouchers', 'ShootingStarIcon', '/vouchers', 'main', 5),
  ('nav.busTickets', 'TableIcon', '/bus-tickets', 'main', 6),
  ('nav.report', 'PieChartIcon', '/report', 'main', 8),
  ('nav.payments', 'DollarLineIcon', '/report/payments', 'main', 9);

-- Insert facilities menu with submenu
INSERT INTO public.menu_items (name_key, icon, menu_group, display_order) 
VALUES ('nav.facilities', 'GridIcon', 'main', 7);

-- Insert facilities submenu items
INSERT INTO public.menu_items (name_key, path, parent_id, menu_group, display_order) 
VALUES 
  ('nav.allFacilities', '/facilities', (SELECT id FROM public.menu_items WHERE name_key = 'nav.facilities' AND menu_group = 'main'), 'main', 1),
  ('nav.bookingManagement', '/facilities/bookings', (SELECT id FROM public.menu_items WHERE name_key = 'nav.facilities' AND menu_group = 'main'), 'main', 2);

-- Insert MASTER DATA menu items
-- Locations submenu
INSERT INTO public.menu_items (name_key, icon, menu_group, display_order) 
VALUES ('nav.locations', 'GridIcon', 'masterData', 1);

INSERT INTO public.menu_items (name_key, path, parent_id, menu_group, display_order) 
VALUES 
  ('nav.province', '/locations/province', (SELECT id FROM public.menu_items WHERE name_key = 'nav.locations' AND menu_group = 'masterData'), 'masterData', 1),
  ('nav.ward', '/locations/ward', (SELECT id FROM public.menu_items WHERE name_key = 'nav.locations' AND menu_group = 'masterData'), 'masterData', 2);

-- Building submenu
INSERT INTO public.menu_items (name_key, icon, menu_group, display_order) 
VALUES ('nav.building', 'BoxCubeIcon', 'masterData', 2);

INSERT INTO public.menu_items (name_key, path, parent_id, menu_group, display_order) 
VALUES 
  ('nav.buildingCategory', '/buildings/category', (SELECT id FROM public.menu_items WHERE name_key = 'nav.building'), 'masterData', 1),
  ('nav.property', '/buildings/property', (SELECT id FROM public.menu_items WHERE name_key = 'nav.building'), 'masterData', 2),
  ('nav.zoneAreaSection', '/buildings/zone-area-section', (SELECT id FROM public.menu_items WHERE name_key = 'nav.building'), 'masterData', 3),
  ('nav.buildingBlock', '/buildings/building-block', (SELECT id FROM public.menu_items WHERE name_key = 'nav.building'), 'masterData', 4),
  ('nav.floor', '/buildings/floor', (SELECT id FROM public.menu_items WHERE name_key = 'nav.building'), 'masterData', 5),
  ('nav.propertyUnit', '/buildings/property-unit', (SELECT id FROM public.menu_items WHERE name_key = 'nav.building'), 'masterData', 6);

-- Asset Maintenance submenu
INSERT INTO public.menu_items (name_key, icon, menu_group, display_order) 
VALUES ('nav.assetMaintenance', 'ListIcon', 'masterData', 3);

INSERT INTO public.menu_items (name_key, path, parent_id, menu_group, display_order) 
VALUES 
  ('nav.allAssets', '/assets', (SELECT id FROM public.menu_items WHERE name_key = 'nav.assetMaintenance'), 'masterData', 1),
  ('nav.maintenance', '/maintenance', (SELECT id FROM public.menu_items WHERE name_key = 'nav.assetMaintenance'), 'masterData', 2),
  ('nav.maintenanceSchedule', '/maintenance/schedule', (SELECT id FROM public.menu_items WHERE name_key = 'nav.assetMaintenance'), 'masterData', 3);

-- Other master data items
INSERT INTO public.menu_items (name_key, icon, path, menu_group, display_order) VALUES
  ('nav.ticketsManagement', 'TableIcon', '/master-data/tickets-management', 'masterData', 4),
  ('nav.shopManagement', 'GridIcon', '/master-data/shop-management', 'masterData', 5);

-- User Management submenu
INSERT INTO public.menu_items (name_key, icon, menu_group, display_order) 
VALUES ('nav.userManagement', 'UserCircleIcon', 'masterData', 6);

INSERT INTO public.menu_items (name_key, path, parent_id, menu_group, display_order) 
VALUES 
  ('nav.allUsers', '/user-management/users', (SELECT id FROM public.menu_items WHERE name_key = 'nav.userManagement'), 'masterData', 1),
  ('nav.userRoles', '/user-management/roles', (SELECT id FROM public.menu_items WHERE name_key = 'nav.userManagement'), 'masterData', 2),
  ('nav.rolePermissions', '/user-management/permissions', (SELECT id FROM public.menu_items WHERE name_key = 'nav.userManagement'), 'masterData', 3);

-- Insert SYSTEM CONFIG menu items
INSERT INTO public.menu_items (name_key, icon, menu_group, display_order) 
VALUES ('nav.settings', 'PlugInIcon', 'systemConfig', 1);

INSERT INTO public.menu_items (name_key, path, parent_id, menu_group, display_order) 
VALUES 
  ('nav.generalSettings', '/settings/general', (SELECT id FROM public.menu_items WHERE name_key = 'nav.settings'), 'systemConfig', 1),
  ('nav.systemConfig', '/settings/system', (SELECT id FROM public.menu_items WHERE name_key = 'nav.settings'), 'systemConfig', 2),
  ('nav.notifications', '/settings/notifications', (SELECT id FROM public.menu_items WHERE name_key = 'nav.settings'), 'systemConfig', 3);

-- Assign all menu items to admin role
INSERT INTO public.role_menu_items (role_id, menu_item_id)
SELECT r.id, m.id
FROM public.roles r
CROSS JOIN public.menu_items m
WHERE r.name = 'admin';

-- Assign limited menu items to user/resident/all_users roles (only main menu - residents, events, announcements)
INSERT INTO public.role_menu_items (role_id, menu_item_id)
SELECT r.id, m.id
FROM public.roles r
CROSS JOIN public.menu_items m
WHERE r.name IN ('user', 'resident', 'all_users')
  AND m.name_key IN ('nav.resident', 'nav.allEvents', 'nav.announcements', 'nav.allVouchers', 'nav.busTickets')
  AND m.menu_group = 'main';
