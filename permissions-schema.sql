-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_permissions_category ON permissions(category);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Enable Row Level Security
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON permissions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON permissions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON permissions;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON permissions;

DROP POLICY IF EXISTS "Enable read access for all users" ON role_permissions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON role_permissions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON role_permissions;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON role_permissions;

-- Create RLS policies for permissions
CREATE POLICY "Enable read access for all users" ON permissions
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON permissions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON permissions
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON permissions
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for role_permissions
CREATE POLICY "Enable read access for all users" ON role_permissions
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON role_permissions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON role_permissions
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON role_permissions
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_permissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER trigger_update_permissions_updated_at
  BEFORE UPDATE ON permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_permissions_updated_at();

-- Insert sample permissions
INSERT INTO permissions (name, description, category) VALUES
  -- User Management
  ('users.view', 'View users list', 'User Management'),
  ('users.create', 'Create new users', 'User Management'),
  ('users.edit', 'Edit existing users', 'User Management'),
  ('users.delete', 'Delete users', 'User Management'),
  
  -- Role Management
  ('roles.view', 'View roles list', 'Role Management'),
  ('roles.create', 'Create new roles', 'Role Management'),
  ('roles.edit', 'Edit existing roles', 'Role Management'),
  ('roles.delete', 'Delete roles', 'Role Management'),
  
  -- Permission Management
  ('permissions.view', 'View permissions', 'Permission Management'),
  ('permissions.manage', 'Manage role permissions', 'Permission Management'),
  
  -- Facility Management
  ('facilities.view', 'View facilities', 'Facility Management'),
  ('facilities.create', 'Create new facilities', 'Facility Management'),
  ('facilities.edit', 'Edit existing facilities', 'Facility Management'),
  ('facilities.delete', 'Delete facilities', 'Facility Management'),
  
  -- Booking Management
  ('bookings.view', 'View bookings', 'Booking Management'),
  ('bookings.create', 'Create new bookings', 'Booking Management'),
  ('bookings.edit', 'Edit existing bookings', 'Booking Management'),
  ('bookings.delete', 'Delete bookings', 'Booking Management'),
  
  -- Building Management
  ('buildings.view', 'View buildings', 'Building Management'),
  ('buildings.create', 'Create new buildings', 'Building Management'),
  ('buildings.edit', 'Edit existing buildings', 'Building Management'),
  ('buildings.delete', 'Delete buildings', 'Building Management'),
  
  -- Resident Management
  ('residents.view', 'View residents', 'Resident Management'),
  ('residents.create', 'Create new residents', 'Resident Management'),
  ('residents.edit', 'Edit existing residents', 'Resident Management'),
  ('residents.delete', 'Delete residents', 'Resident Management'),
  
  -- Location Management
  ('locations.view', 'View locations', 'Location Management'),
  ('locations.create', 'Create new locations', 'Location Management'),
  ('locations.edit', 'Edit existing locations', 'Location Management'),
  ('locations.delete', 'Delete locations', 'Location Management'),
  
  -- Voucher Management
  ('vouchers.view', 'View vouchers', 'Voucher Management'),
  ('vouchers.create', 'Create new vouchers', 'Voucher Management'),
  ('vouchers.edit', 'Edit existing vouchers', 'Voucher Management'),
  ('vouchers.delete', 'Delete vouchers', 'Voucher Management'),
  
  -- Shop Management
  ('shops.view', 'View shops', 'Shop Management'),
  ('shops.create', 'Create new shops', 'Shop Management'),
  ('shops.edit', 'Edit existing shops', 'Shop Management'),
  ('shops.delete', 'Delete shops', 'Shop Management'),
  
  -- Event Management
  ('events.view', 'View events', 'Event Management'),
  ('events.create', 'Create new events', 'Event Management'),
  ('events.edit', 'Edit existing events', 'Event Management'),
  ('events.delete', 'Delete events', 'Event Management'),
  
  -- Dashboard Access
  ('dashboard.view', 'Access dashboard', 'Dashboard'),
  ('reports.view', 'View reports', 'Dashboard'),
  ('analytics.view', 'View analytics', 'Dashboard')
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE permissions IS 'Stores system permissions';
COMMENT ON TABLE role_permissions IS 'Junction table linking roles to permissions';
COMMENT ON COLUMN permissions.name IS 'Unique permission identifier (e.g., users.view)';
COMMENT ON COLUMN permissions.category IS 'Permission category for grouping';
