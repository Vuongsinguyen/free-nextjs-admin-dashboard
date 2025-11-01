const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read env variables from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.+)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkPermissions() {
  console.log('🔍 Checking permissions table...\n');

  // Check if permissions table exists and has data
  const { data: permissions, error: permError, count } = await supabase
    .from('permissions')
    .select('*', { count: 'exact' });

  if (permError) {
    console.error('❌ Error fetching permissions:', permError.message);
    console.log('\n📝 You need to run the permissions-schema.sql file in Supabase SQL Editor');
    return;
  }

  console.log(`✅ Permissions table exists`);
  console.log(`📊 Total permissions: ${count || 0}\n`);

  if (!permissions || permissions.length === 0) {
    console.log('⚠️  No permissions found in database!');
    console.log('\n📝 Please run this SQL in Supabase SQL Editor:');
    console.log('   File: permissions-schema.sql\n');
    return;
  }

  // Group by category
  const grouped = permissions.reduce((acc, perm) => {
    const cat = perm.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(perm);
    return acc;
  }, {});

  console.log('📋 Permissions by category:\n');
  Object.keys(grouped).sort().forEach(category => {
    console.log(`  ${category}: ${grouped[category].length} permissions`);
    grouped[category].forEach(p => {
      console.log(`    - ${p.name}: ${p.description || 'No description'}`);
    });
    console.log('');
  });

  // Check role_permissions table
  const { data: rolePerms, error: rpError } = await supabase
    .from('role_permissions')
    .select('*');

  if (rpError) {
    console.error('❌ Error fetching role_permissions:', rpError.message);
  } else {
    console.log(`✅ Role permissions table exists`);
    console.log(`📊 Total role-permission assignments: ${rolePerms?.length || 0}\n`);
  }
}

checkPermissions().catch(console.error);
