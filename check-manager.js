// Script to check and update manager@example.com role
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

async function checkAndUpdateManager() {
  console.log('🔍 Checking manager@example.com account...\n');

  try {
    // Get user from Auth
    const { data: authData } = await supabase.auth.admin.listUsers();
    const managerUser = authData?.users.find(u => u.email === 'manager@example.com');
    
    if (!managerUser) {
      console.error('❌ User manager@example.com not found in Auth');
      return;
    }

    console.log('📋 Current Auth metadata:');
    console.log('   Email:', managerUser.email);
    console.log('   Name:', managerUser.user_metadata?.name);
    console.log('   Role:', managerUser.user_metadata?.role);

    // Get user from table
    const { data: tableData } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'manager@example.com')
      .single();

    if (tableData) {
      console.log('\n📋 Current users table:');
      console.log('   Email:', tableData.email);
      console.log('   Name:', tableData.name);
      console.log('   Role:', tableData.role);
    }

    const currentRole = managerUser.user_metadata?.role || tableData?.role;
    
    if (currentRole !== 'manager') {
      console.log(`\n🔄 Role mismatch detected! Current: "${currentRole}" → Expected: "manager"`);
      console.log('\n1️⃣  Updating Auth user metadata...');
      
      const { data: updatedAuthUser, error: authError } = await supabase.auth.admin.updateUserById(
        managerUser.id,
        {
          user_metadata: {
            ...managerUser.user_metadata,
            role: 'manager'
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
        .update({ role: 'manager' })
        .eq('email', 'manager@example.com')
        .select();

      if (tableError) {
        console.error('❌ Error updating users table:', tableError.message);
        return;
      }

      console.log('✅ Users table updated successfully');
      console.log('   New role:', updatedTableData[0]?.role);

      console.log(`\n🎉 Role update completed: ${currentRole} → manager`);
    } else {
      console.log('\n✅ Role is already correct: "manager"');
      console.log('   No update needed.');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkAndUpdateManager();
