# Building Management System - Setup Guide

## Schema Created

### Tables Hierarchy
```
Building Categories (Independent)
    ↓
Properties (Dự án)
    ↓
Zones/Areas/Sections (Khu vực)
    ↓
Buildings/Blocks (Tòa nhà) ← Building Category
    ↓
Floors (Tầng)
    ↓
Property Units (Căn hộ) ← Residents
```

### 1. Building Categories
Independent table for building types:
- Residential Tower
- Commercial Complex
- Mixed-use Building
- Villa
- Townhouse
- Shophouse
- Office Building
- Parking Building

### 2. Properties (Dự án)
Top-level projects/developments:
- Vinhomes Grand Park
- Vinhomes Central Park
- Masteri Thảo Điền
- The Sun Avenue
- Vinhomes Ocean Park
- Becamex City

### 3. Zones (Khu vực)
Areas within properties:
- The Rainbow, The Origami, The Manhattan (VGP)
- Park Zone, Landmark Zone (VCP)
- Tower A Zone, Tower B Zone (Masteri)
- Aqua Bay, Coastal Hill (VOP)

### 4. Buildings (Tòa nhà)
Individual buildings:
- S1.01, S1.02, M1 (VGP)
- Park 1, Park 2, Landmark 81 (VCP)
- Tower A, Tower B (Masteri)

### 5. Floors (Tầng)
Floors within buildings (sampled for high-rise):
- Generated dynamically based on building's total_floors
- Ground floor (no units), residential floors (8 units each)

### 6. Property Units (Căn hộ)
Individual apartments/units:
- Unit types: 1BR (45m²), 2BR (65-75m²), 3BR (95m²)
- Includes address, province, district, ward
- Links to residents via resident_id and resident_role

## Setup Instructions

### Step 1: Apply Schema
Run the schema in your Supabase SQL Editor:
```sql
-- Copy content from building-management-schema.sql
-- Run in Supabase Dashboard → SQL Editor
```

### Step 2: Seed Data (Master Seed)
Use the master seed endpoint to populate all tables in correct order:

**Option A: Via API (Recommended)**
```bash
# Run dev server
npm run dev

# In another terminal, call master seed
curl -X POST http://localhost:3000/api/building-management/seed-all

# Or use browser/Postman
POST http://localhost:3000/api/building-management/seed-all
```

**Option B: Individual Seeds (Manual)**
If you want to seed tables one by one:
```bash
POST /api/building-categories/seed  # 8 categories
POST /api/properties/seed            # 6 properties
POST /api/zones/seed                 # 11 zones
POST /api/buildings/seed             # 13 buildings
POST /api/floors/seed                # ~60 floors (sampled)
POST /api/property-units/seed        # ~120 units
```

**Expected Results:**
```
✅ Building Categories: 8 records
✅ Properties: 6 records
✅ Zones: 11 records
✅ Buildings: 13 records
✅ Floors: ~60 records (high-rise sampled every 5 floors)
✅ Property Units: ~120 records (2-4 units per floor)
```

### Step 3: Verify Data
Check your Supabase Table Editor or run queries:
```sql
-- Check hierarchy counts
SELECT 
    (SELECT COUNT(*) FROM building_categories) as categories,
    (SELECT COUNT(*) FROM properties) as properties,
    (SELECT COUNT(*) FROM zones) as zones,
    (SELECT COUNT(*) FROM buildings) as buildings,
    (SELECT COUNT(*) FROM floors) as floors,
    (SELECT COUNT(*) FROM property_units) as units;

-- Use the helper view for full context
SELECT * FROM property_units_full LIMIT 10;
```

## API Endpoints

### Seed Endpoints (POST)
- `/api/building-categories/seed` - Seed building categories
- `/api/properties/seed` - Seed properties
- `/api/zones/seed` - Seed zones (requires properties)
- `/api/buildings/seed` - Seed buildings (requires zones & categories)
- `/api/floors/seed` - Seed floors (requires buildings)
- `/api/property-units/seed` - Seed property units (requires floors)
- `/api/building-management/seed-all` - Master seed (all tables in order)

### CRUD Endpoints (To be created)
You'll need to create these based on your UI requirements:
- `GET /api/properties` - List all properties
- `GET /api/zones?property_id=...` - Get zones for property
- `GET /api/buildings?zone_id=...` - Get buildings for zone
- `GET /api/floors?building_id=...` - Get floors for building
- `GET /api/property-units?floor_id=...` - Get units for floor

## Database Features

### Indexes
Optimized for filtering:
- Status filters on all tables
- Province, district, ward on properties and units
- Code lookups (UNIQUE indexes)
- Foreign key relationships

### Row Level Security (RLS)
All tables have policies allowing authenticated and anonymous users:
```sql
FOR ALL TO authenticated, anon
USING (true)
WITH CHECK (true)
```

### Triggers
Auto-update `updated_at` timestamp on all tables.

### Helper View
`property_units_full` - Denormalized view showing complete hierarchy:
- Unit details (name, code, address, area, bedrooms, bathrooms)
- Floor (name, number)
- Building (name, code, category)
- Zone (name)
- Property (name, code)

## Sample Queries

### Get all units in a property
```sql
SELECT * 
FROM property_units_full 
WHERE property_code = 'VGP'
ORDER BY building_name, floor_number, unit_name;
```

### Get available units in a building
```sql
SELECT u.*
FROM property_units u
JOIN floors f ON u.floor_id = f.id
JOIN buildings b ON f.building_id = b.id
WHERE b.code = 'VGP_RAINBOW_S101'
  AND u.status = 'available';
```

### Get building occupancy statistics
```sql
SELECT 
    b.name as building,
    COUNT(u.id) as total_units,
    COUNT(CASE WHEN u.status = 'occupied' THEN 1 END) as occupied,
    COUNT(CASE WHEN u.status = 'available' THEN 1 END) as available,
    ROUND(
        COUNT(CASE WHEN u.status = 'occupied' THEN 1 END)::numeric / 
        NULLIF(COUNT(u.id), 0) * 100, 
        2
    ) as occupancy_rate
FROM buildings b
LEFT JOIN floors f ON f.building_id = b.id
LEFT JOIN property_units u ON u.floor_id = f.id
GROUP BY b.id, b.name
ORDER BY b.name;
```

## Next Steps

### 1. Create UI Pages
Based on the structure, you might want:
- `/buildings/property` - Manage properties
- `/buildings/zone` - Manage zones
- `/buildings/building` - Manage buildings (already exists?)
- `/buildings/floor` - Manage floors
- `/buildings/property-unit` - Manage units (already exists?)

### 2. Link to Residents
The `property_units` table has:
- `resident_id` - To link with users/residents table
- `resident_role` - 'owner', 'tenant', 'family_member', etc.

Update these fields when assigning residents to units.

### 3. Add More Sample Data
The current seed creates ~120 units. To add more:
- Modify the sampling logic in `/api/floors/seed` (remove `shouldSample` condition)
- Increase `unitsPerFloor` in `/api/property-units/seed`
- Run individual seeds again

## Troubleshooting

### Missing SUPABASE_SERVICE_ROLE_KEY
If you get "Supabase admin client not configured":
1. Go to Supabase Dashboard → Settings → API
2. Copy **service_role** key (NOT anon key)
3. Add to `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
4. Restart dev server

### Foreign Key Errors
Seeds must run in order:
1. Building Categories (independent)
2. Properties (independent)
3. Zones (needs properties)
4. Buildings (needs zones + categories)
5. Floors (needs buildings)
6. Property Units (needs floors)

Master seed `/api/building-management/seed-all` handles this automatically.

### Duplicate Key Errors
Seeds use `upsert` with conflict resolution:
- Building Categories: `code`
- Properties: `code`
- Zones: `code`
- Buildings: `code`
- Floors: `(building_id, floor_number)`
- Property Units: `code`

Running seeds multiple times will update existing records.

## File Structure

```
building-management-schema.sql          # Database schema
src/app/api/
  ├── building-categories/seed/route.ts # 8 categories
  ├── properties/seed/route.ts          # 6 properties
  ├── zones/seed/route.ts               # 11 zones
  ├── buildings/seed/route.ts           # 13 buildings
  ├── floors/seed/route.ts              # ~60 floors
  ├── property-units/seed/route.ts      # ~120 units
  └── building-management/
      └── seed-all/route.ts             # Master seed
```

## Production Deployment

Remember to set environment variables in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` ← **Required for seed endpoints**

Then run master seed on production:
```bash
POST https://your-domain.com/api/building-management/seed-all
```
