const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    envVars[key] = value;
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function seedPermissions() {
  console.log('🔄 Seeding permissions...\n');

  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync(path.join(__dirname, 'permissions-schema.sql'), 'utf8');
    
    // Execute the SQL via Supabase REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sqlContent })
    });

    // If the exec_sql RPC doesn't exist, we'll use the @supabase/supabase-js approach
    // Let's use fetch to execute the permissions insert directly
    
    const permissions = [
      // User Management
      { name: 'users.view', description: 'View users list', category: 'User Management' },
      { name: 'users.create', description: 'Create new users', category: 'User Management' },
      { name: 'users.edit', description: 'Edit existing users', category: 'User Management' },
      { name: 'users.delete', description: 'Delete users', category: 'User Management' },
      
      // Role Management
      { name: 'roles.view', description: 'View roles list', category: 'Role Management' },
      { name: 'roles.create', description: 'Create new roles', category: 'Role Management' },
      { name: 'roles.edit', description: 'Edit existing roles', category: 'Role Management' },
      { name: 'roles.delete', description: 'Delete roles', category: 'Role Management' },
      
      // Permission Management
      { name: 'permissions.view', description: 'View permissions', category: 'Permission Management' },
      { name: 'permissions.manage', description: 'Manage role permissions', category: 'Permission Management' },
      
      // Facility Management
      { name: 'facilities.view', description: 'View facilities', category: 'Facility Management' },
      { name: 'facilities.create', description: 'Create new facilities', category: 'Facility Management' },
      { name: 'facilities.edit', description: 'Edit existing facilities', category: 'Facility Management' },
      { name: 'facilities.delete', description: 'Delete facilities', category: 'Facility Management' },
      
      // Booking Management
      { name: 'bookings.view', description: 'View bookings', category: 'Booking Management' },
      { name: 'bookings.create', description: 'Create new bookings', category: 'Booking Management' },
      { name: 'bookings.edit', description: 'Edit existing bookings', category: 'Booking Management' },
      { name: 'bookings.delete', description: 'Delete bookings', category: 'Booking Management' },
      
      // Building Management
      { name: 'buildings.view', description: 'View buildings', category: 'Building Management' },
      { name: 'buildings.create', description: 'Create new buildings', category: 'Building Management' },
      { name: 'buildings.edit', description: 'Edit existing buildings', category: 'Building Management' },
      { name: 'buildings.delete', description: 'Delete buildings', category: 'Building Management' },
      
      // Resident Management
      { name: 'residents.view', description: 'View residents', category: 'Resident Management' },
      { name: 'residents.create', description: 'Create new residents', category: 'Resident Management' },
      { name: 'residents.edit', description: 'Edit existing residents', category: 'Resident Management' },
      { name: 'residents.delete', description: 'Delete residents', category: 'Resident Management' },
      
      // Location Management
      { name: 'locations.view', description: 'View locations', category: 'Location Management' },
      { name: 'locations.create', description: 'Create new locations', category: 'Location Management' },
      { name: 'locations.edit', description: 'Edit existing locations', category: 'Location Management' },
      { name: 'locations.delete', description: 'Delete locations', category: 'Location Management' },
      
      // Voucher Management
      { name: 'vouchers.view', description: 'View vouchers', category: 'Voucher Management' },
      { name: 'vouchers.create', description: 'Create new vouchers', category: 'Voucher Management' },
      { name: 'vouchers.edit', description: 'Edit existing vouchers', category: 'Voucher Management' },
      { name: 'vouchers.delete', description: 'Delete vouchers', category: 'Voucher Management' },
      
      // Shop Management
      { name: 'shops.view', description: 'View shops', category: 'Shop Management' },
      { name: 'shops.create', description: 'Create new shops', category: 'Shop Management' },
      { name: 'shops.edit', description: 'Edit existing shops', category: 'Shop Management' },
      { name: 'shops.delete', description: 'Delete shops', category: 'Shop Management' },
      
      // Event Management
      { name: 'events.view', description: 'View events', category: 'Event Management' },
      { name: 'events.create', description: 'Create new events', category: 'Event Management' },
      { name: 'events.edit', description: 'Edit existing events', category: 'Event Management' },
      { name: 'events.delete', description: 'Delete events', category: 'Event Management' },
      
      // Dashboard
      { name: 'dashboard.view', description: 'Access dashboard', category: 'Dashboard' },
      { name: 'reports.view', description: 'View reports', category: 'Dashboard' },
      { name: 'analytics.view', description: 'View analytics', category: 'Dashboard' }
    ];

    // Insert permissions using Supabase REST API
    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'resolution=ignore-duplicates'
      },
      body: JSON.stringify(permissions)
    });

    if (!insertResponse.ok) {
      const error = await insertResponse.text();
      throw new Error(`Failed to insert permissions: ${error}`);
    }

    console.log('✅ Successfully seeded permissions!\n');

    // Verify the insert
    const verifyResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/permissions?select=category,name&order=category,name`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );

    if (verifyResponse.ok) {
      const data = await verifyResponse.json();
      console.log(`📊 Total permissions in database: ${data.length}\n`);
      
      // Group by category
      const grouped = data.reduce((acc, perm) => {
        if (!acc[perm.category]) {
          acc[perm.category] = [];
        }
        acc[perm.category].push(perm.name);
        return acc;
      }, {});

      console.log('📋 Permissions by category:\n');
      Object.entries(grouped).forEach(([category, perms]) => {
        console.log(`  ${category} (${perms.length}):`);
        perms.forEach(p => console.log(`    - ${p}`));
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error seeding permissions:', error);
    process.exit(1);
  }
}

seedPermissions();
