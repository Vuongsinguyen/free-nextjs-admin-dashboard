-- =====================================================
-- BUILDING MANAGEMENT SCHEMA
-- =====================================================
-- Hierarchy: Property > Zone > Building > Floor > Property Unit
-- Created: 2025-11-01
-- =====================================================

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS property_units CASCADE;
DROP TABLE IF EXISTS floors CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS zones CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS building_categories CASCADE;

-- =====================================================
-- 1. BUILDING CATEGORIES (Independent table)
-- =====================================================
CREATE TABLE building_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Index
CREATE INDEX idx_building_categories_status ON building_categories(status);
CREATE INDEX idx_building_categories_code ON building_categories(code);

-- RLS
ALTER TABLE building_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for authenticated and anon users" ON building_categories
    FOR ALL TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- Trigger
CREATE TRIGGER update_building_categories_updated_at
    BEFORE UPDATE ON building_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. PROPERTIES (Top level - Dự án)
-- =====================================================
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    address TEXT,
    province TEXT,
    district TEXT,
    ward TEXT,
    total_area NUMERIC,
    status TEXT CHECK (status IN ('active', 'inactive', 'planned', 'under_construction')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Index
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_code ON properties(code);
CREATE INDEX idx_properties_province ON properties(province);

-- RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for authenticated and anon users" ON properties
    FOR ALL TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- Trigger
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. ZONES/AREAS/SECTIONS (Level 2 - Khu vực)
-- =====================================================
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(property_id, name)
);

-- Index
CREATE INDEX idx_zones_property_id ON zones(property_id);
CREATE INDEX idx_zones_status ON zones(status);
CREATE INDEX idx_zones_code ON zones(code);

-- RLS
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for authenticated and anon users" ON zones
    FOR ALL TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- Trigger
CREATE TRIGGER update_zones_updated_at
    BEFORE UPDATE ON zones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. BUILDINGS/BLOCKS (Level 3 - Tòa nhà)
-- =====================================================
CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    building_category_id UUID REFERENCES building_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    total_floors INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(zone_id, name)
);

-- Index
CREATE INDEX idx_buildings_zone_id ON buildings(zone_id);
CREATE INDEX idx_buildings_category_id ON buildings(building_category_id);
CREATE INDEX idx_buildings_status ON buildings(status);
CREATE INDEX idx_buildings_code ON buildings(code);

-- RLS
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for authenticated and anon users" ON buildings
    FOR ALL TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- Trigger
CREATE TRIGGER update_buildings_updated_at
    BEFORE UPDATE ON buildings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. FLOORS (Level 4 - Tầng)
-- =====================================================
CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    floor_number INTEGER NOT NULL,
    description TEXT,
    total_units INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(building_id, floor_number),
    UNIQUE(building_id, name)
);

-- Index
CREATE INDEX idx_floors_building_id ON floors(building_id);
CREATE INDEX idx_floors_floor_number ON floors(building_id, floor_number);
CREATE INDEX idx_floors_status ON floors(status);

-- RLS
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for authenticated and anon users" ON floors
    FOR ALL TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- Trigger
CREATE TRIGGER update_floors_updated_at
    BEFORE UPDATE ON floors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. PROPERTY UNITS (Level 5 - Căn hộ)
-- =====================================================
CREATE TABLE property_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    floor_id UUID NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    address TEXT,
    province TEXT,
    district TEXT,
    ward TEXT,
    area NUMERIC,
    bedrooms INTEGER,
    bathrooms INTEGER,
    resident_id UUID, -- Will reference users/residents table
    resident_role TEXT, -- e.g., 'owner', 'tenant', 'family_member'
    status TEXT CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')) DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Index
CREATE INDEX idx_property_units_floor_id ON property_units(floor_id);
CREATE INDEX idx_property_units_code ON property_units(code);
CREATE INDEX idx_property_units_resident_id ON property_units(resident_id);
CREATE INDEX idx_property_units_status ON property_units(status);
CREATE INDEX idx_property_units_province ON property_units(province);
CREATE INDEX idx_property_units_ward ON property_units(ward);

-- RLS
ALTER TABLE property_units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for authenticated and anon users" ON property_units
    FOR ALL TO authenticated, anon
    USING (true)
    WITH CHECK (true);

-- Trigger
CREATE TRIGGER update_property_units_updated_at
    BEFORE UPDATE ON property_units
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER VIEWS
-- =====================================================

-- View: Full property unit information with hierarchy
CREATE OR REPLACE VIEW property_units_full AS
SELECT 
    pu.id,
    pu.name AS unit_name,
    pu.code AS unit_code,
    pu.address AS unit_address,
    pu.province,
    pu.district,
    pu.ward,
    pu.area,
    pu.bedrooms,
    pu.bathrooms,
    pu.resident_id,
    pu.resident_role,
    pu.status AS unit_status,
    f.name AS floor_name,
    f.floor_number,
    b.name AS building_name,
    b.code AS building_code,
    bc.name AS building_category,
    z.name AS zone_name,
    p.name AS property_name,
    p.code AS property_code,
    pu.created_at,
    pu.updated_at
FROM property_units pu
LEFT JOIN floors f ON pu.floor_id = f.id
LEFT JOIN buildings b ON f.building_id = b.id
LEFT JOIN building_categories bc ON b.building_category_id = bc.id
LEFT JOIN zones z ON b.zone_id = z.id
LEFT JOIN properties p ON z.property_id = p.id;

-- =====================================================
-- SAMPLE COMMENTS
-- =====================================================

COMMENT ON TABLE building_categories IS 'Building types/categories (e.g., Residential, Commercial, Mixed-use)';
COMMENT ON TABLE properties IS 'Top-level properties/projects (Dự án)';
COMMENT ON TABLE zones IS 'Zones/Areas/Sections within a property (Khu vực)';
COMMENT ON TABLE buildings IS 'Buildings/Blocks within a zone (Tòa nhà)';
COMMENT ON TABLE floors IS 'Floors within a building (Tầng)';
COMMENT ON TABLE property_units IS 'Individual units/apartments (Căn hộ)';

COMMENT ON COLUMN property_units.resident_id IS 'Reference to resident/user who occupies this unit';
COMMENT ON COLUMN property_units.resident_role IS 'Role of resident: owner, tenant, family_member, etc.';
