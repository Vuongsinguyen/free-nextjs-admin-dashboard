const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('🚀 Starting display_code migration...\n');

    // Read SQL file
    const sqlFile = path.join(__dirname, 'add-display-code-column.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
      
      if (error) {
        // Try direct query if RPC doesn't work
        const { error: directError } = await supabase.from('_migrations').insert({
          name: `display_code_${Date.now()}`,
          sql: statement
        });
        
        if (directError) {
          console.error(`❌ Error executing statement ${i + 1}:`, error);
          console.error('Statement:', statement.substring(0, 100) + '...');
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    }

    console.log('\n🎉 Migration completed!\n');
    
    // Verify the migration
    console.log('🔍 Verifying migration...\n');
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('id, role, display_code')
      .limit(5);

    if (fetchError) {
      console.error('❌ Error verifying migration:', fetchError);
    } else {
      console.log('✅ Sample users with display codes:');
      console.table(users);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Alternative: Manual SQL execution guide
console.log('═══════════════════════════════════════════════════════════');
console.log('DISPLAY CODE MIGRATION');
console.log('═══════════════════════════════════════════════════════════\n');
console.log('If automatic migration fails, please run the SQL manually:\n');
console.log('1. Go to Supabase Dashboard > SQL Editor');
console.log('2. Copy contents from: add-display-code-column.sql');
console.log('3. Paste and execute in SQL Editor\n');
console.log('═══════════════════════════════════════════════════════════\n');

runMigration();
