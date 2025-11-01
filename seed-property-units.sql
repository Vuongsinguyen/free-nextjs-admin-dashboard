-- Seed Property Units
-- Make sure you have floors in your database first!
-- This uses the actual schema from building-management-schema.sql

-- Insert 10 sample property units
INSERT INTO property_units (name, code, area, bedrooms, bathrooms, status, floor_id) 
SELECT 
  'Unit A101', 
  'A101', 
  75.5, 
  2, 
  2, 
  'available', 
  f.id
FROM floors f 
WHERE f.floor_number = 1 
LIMIT 1;

INSERT INTO property_units (name, code, area, bedrooms, bathrooms, status, floor_id) 
SELECT 
  'Unit A102', 
  'A102', 
  85.0, 
  3, 
  2, 
  'occupied', 
  f.id
FROM floors f 
WHERE f.floor_number = 1 
LIMIT 1;

INSERT INTO property_units (name, code, area, bedrooms, bathrooms, status, floor_id) 
SELECT 
  'Unit A201', 
  'A201', 
  90.0, 
  3, 
  2, 
  'available', 
  f.id
FROM floors f 
WHERE f.floor_number = 2 
LIMIT 1;

INSERT INTO property_units (name, code, area, bedrooms, bathrooms, status, floor_id) 
SELECT 
  'Unit A202', 
  'A202', 
  65.0, 
  2, 
  1, 
  'occupied', 
  f.id
FROM floors f 
WHERE f.floor_number = 2 
LIMIT 1;

INSERT INTO property_units (name, code, area, bedrooms, bathrooms, status, floor_id) 
SELECT 
  'Commercial Unit B101', 
  'B101', 
  120.0, 
  NULL, 
  1, 
  'available', 
  f.id
FROM floors f 
WHERE f.floor_number = 1 
LIMIT 1;

INSERT INTO property_units (name, code, area, bedrooms, bathrooms, status, floor_id) 
SELECT 
  'Commercial Unit B102', 
  'B102', 
  150.0, 
  NULL, 
  2, 
  'occupied', 
  f.id
FROM floors f 
WHERE f.floor_number = 1 
LIMIT 1;

INSERT INTO property_units (name, code, area, bedrooms, bathrooms, status, floor_id) 
SELECT 
  'Parking Slot P-001', 
  'P-001', 
  15.0, 
  NULL, 
  NULL, 
  'available', 
  f.id
FROM floors f 
WHERE f.floor_number = -1 
LIMIT 1;

INSERT INTO property_units (name, code, area, bedrooms, bathrooms, status, floor_id) 
SELECT 
  'Parking Slot P-002', 
  'P-002', 
  15.0, 
  NULL, 
  NULL, 
  'occupied', 
  f.id
FROM floors f 
WHERE f.floor_number = -1 
LIMIT 1;

INSERT INTO property_units (name, code, area, bedrooms, bathrooms, status, floor_id) 
SELECT 
  'Storage Unit S-001', 
  'S-001', 
  10.0, 
  NULL, 
  NULL, 
  'available', 
  f.id
FROM floors f 
WHERE f.floor_number = -1 
LIMIT 1;

INSERT INTO property_units (name, code, area, bedrooms, bathrooms, status, floor_id) 
SELECT 
  'Unit A301', 
  'A301', 
  100.0, 
  3, 
  3, 
  'maintenance', 
  f.id
FROM floors f 
WHERE f.floor_number = 3 
LIMIT 1;

-- Verify the data
SELECT 
  pu.name,
  pu.code,
  pu.area,
  pu.bedrooms,
  pu.bathrooms,
  pu.status,
  f.name as floor_name,
  f.floor_number
FROM property_units pu
JOIN floors f ON pu.floor_id = f.id
ORDER BY pu.code;

-- Count total
SELECT COUNT(*) as total_property_units FROM property_units;
