// Script to check existing users in Supabase
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
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUsers() {
  console.log('🔍 Checking users in Supabase Auth...\n');

  try {
    // Check Auth users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching Auth users:', authError.message);
    } else {
      console.log(`📊 Total Auth users: ${authData.users.length}\n`);
      
      if (authData.users.length > 0) {
        console.log('Auth Users:');
        authData.users.forEach((user, index) => {
          console.log(`  ${index + 1}. Email: ${user.email}`);
          console.log(`     ID: ${user.id}`);
          console.log(`     Created: ${new Date(user.created_at).toLocaleString()}`);
          console.log(`     Metadata:`, user.user_metadata);
          console.log('');
        });
      } else {
        console.log('⚠️  No users found in Supabase Auth');
      }
    }

    // Check users table
    console.log('\n🔍 Checking users table...\n');
    const { data: tableData, error: tableError } = await supabase
      .from('users')
      .select('id, email, name, role, status')
      .order('created_at', { ascending: true });

    if (tableError) {
      if (tableError.code === '42P01') {
        console.log('⚠️  Users table does not exist yet');
      } else {
        console.error('❌ Error fetching users table:', tableError.message);
      }
    } else {
      console.log(`📊 Total users in table: ${tableData?.length || 0}\n`);
      
      if (tableData && tableData.length > 0) {
        console.log('Users Table:');
        tableData.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.email} (${user.role}) - ${user.status}`);
        });
      } else {
        console.log('⚠️  No users found in users table');
      }
    }

    // Check for specific test account
    console.log('\n🔍 Checking for digital@example.com...\n');
    const { data: digitalUser } = await supabase.auth.admin.listUsers();
    const digital = digitalUser?.users.find(u => u.email === 'digital@example.com');
    
    if (digital) {
      console.log('✅ digital@example.com exists in Auth');
      console.log('   User metadata:', digital.user_metadata);
    } else {
      console.log('❌ digital@example.com NOT found in Auth');
      console.log('   You need to create this user first');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkUsers();
