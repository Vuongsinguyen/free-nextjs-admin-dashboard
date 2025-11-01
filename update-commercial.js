// Script to check and update commercial@example.com
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

async function updateCommercial() {
  console.log('🔍 Checking commercial@example.com account...\n');

  try {
    // Get user from Auth
    const { data: authData } = await supabase.auth.admin.listUsers();
    const commercialUser = authData?.users.find(u => u.email === 'commercial@example.com');
    
    if (!commercialUser) {
      console.error('❌ User commercial@example.com not found in Auth');
      return;
    }

    console.log('📋 Current Auth metadata:');
    console.log('   Email:', commercialUser.email);
    console.log('   Name:', commercialUser.user_metadata?.name);
    console.log('   Role:', commercialUser.user_metadata?.role);

    // Get user from table
    const { data: tableData } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'commercial@example.com')
      .single();

    if (tableData) {
      console.log('\n📋 Current users table:');
      console.log('   Email:', tableData.email);
      console.log('   Name:', tableData.name);
      console.log('   Role:', tableData.role);
    }

    const currentRole = commercialUser.user_metadata?.role || tableData?.role;
    let needsUpdate = false;

    // Check if role needs update
    if (currentRole !== 'commercial') {
      needsUpdate = true;
      console.log(`\n🔄 Role mismatch detected! Current: "${currentRole}" → Expected: "commercial"`);
      console.log('\n1️⃣  Updating Auth user metadata...');
      
      const { data: updatedAuthUser, error: authError } = await supabase.auth.admin.updateUserById(
        commercialUser.id,
        {
          user_metadata: {
            ...commercialUser.user_metadata,
            role: 'commercial'
          }
        }
      );

      if (authError) {
        console.error('❌ Error updating Auth metadata:', authError.message);
        return;
      }

      console.log('✅ Auth metadata updated successfully');
      console.log('   New role:', updatedAuthUser.user.user_metadata.role);

      console.log('\n2️⃣  Updating users table...');
      
      const { data: updatedTableData, error: tableError } = await supabase
        .from('users')
        .update({ role: 'commercial' })
        .eq('email', 'commercial@example.com')
        .select();

      if (tableError) {
        console.error('❌ Error updating users table:', tableError.message);
        return;
      }

      console.log('✅ Users table updated successfully');
      console.log('   New role:', updatedTableData[0]?.role);
    } else {
      console.log('\n✅ Role is already correct: "commercial"');
    }

    // Update password
    console.log('\n3️⃣  Updating password to default: Passwd!@2025!!!...');
    
    const { data: passwordUpdate, error: passwordError } = await supabase.auth.admin.updateUserById(
      commercialUser.id,
      {
        password: 'Passwd!@2025!!!'
      }
    );

    if (passwordError) {
      console.error('❌ Error updating password:', passwordError.message);
      return;
    }

    console.log('✅ Password updated successfully');

    if (needsUpdate) {
      console.log(`\n🎉 Update completed: ${currentRole} → commercial`);
    } else {
      console.log('\n🎉 Update completed!');
    }
    console.log('   Email: commercial@example.com');
    console.log('   Role: commercial');
    console.log('   Password: Passwd!@2025!!!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateCommercial();
