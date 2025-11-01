// Script to update role from building-owner to digital
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
let supabaseUrl, supabaseServiceKey;

try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
      supabaseUrl = value;
    } else if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
      supabaseServiceKey = value;
    }
  });
} catch (error) {
  console.error('❌ Could not read .env.local file');
  process.exit(1);
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateRole() {
  console.log('🔄 Updating role from building-owner to digital...\n');

  try {
    // 1. Update user metadata in Auth
    console.log('1️⃣  Updating Auth user metadata for digital@example.com...');
    
    // Get user by email
    const { data: authData } = await supabase.auth.admin.listUsers();
    const digitalUser = authData?.users.find(u => u.email === 'digital@example.com');
    
    if (!digitalUser) {
      console.error('❌ User digital@example.com not found in Auth');
      return;
    }

    // Update user metadata
    const { data: updatedAuthUser, error: authError } = await supabase.auth.admin.updateUserById(
      digitalUser.id,
      {
        user_metadata: {
          ...digitalUser.user_metadata,
          role: 'digital'
        }
      }
    );

    if (authError) {
      console.error('❌ Error updating Auth metadata:', authError.message);
      return;
    }

    console.log('✅ Auth metadata updated successfully');
    console.log('   New metadata:', updatedAuthUser.user.user_metadata);

    // 2. Update users table
    console.log('\n2️⃣  Updating users table...');
    
    const { data: tableData, error: tableError } = await supabase
      .from('users')
      .update({ role: 'digital' })
      .eq('email', 'digital@example.com')
      .select();

    if (tableError) {
      console.error('❌ Error updating users table:', tableError.message);
      return;
    }

    console.log('✅ Users table updated successfully');
    if (tableData && tableData.length > 0) {
      console.log('   Updated user:', tableData[0]);
    }

    console.log('\n🎉 Role update completed successfully!');
    console.log('   digital@example.com role: building-owner → digital');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateRole();
