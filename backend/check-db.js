const axios = require('axios');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'setup.sql'), 'utf8');

// Split SQL into individual statements
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

(async () => {
  // Use the Supabase query endpoint
  for (const stmt of statements) {
    try {
      const res = await axios.post(
        `${SUPABASE_URL}/rest/v1/rpc/`,
        {},
        {
          headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
          },
        }
      );
    } catch (err) {
      // Expected to fail, REST API doesn't support raw SQL
    }
  }

  // Test if tables exist
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  
  const { data, error } = await supabase.from('websites').select('id').limit(1);
  if (error && error.code === 'PGRST205') {
    console.log('');
    console.log('================================================');
    console.log('  DATABASE SETUP REQUIRED');
    console.log('================================================');
    console.log('');
    console.log('Tables do not exist. Please run the SQL setup:');
    console.log('');
    console.log('1. Go to: https://supabase.com/dashboard/project/totkvhetdihrugymrubx/sql/new');
    console.log('2. Paste contents of: database/setup.sql');
    console.log('3. Click "Run"');
    console.log('');
    process.exit(1);
  } else if (error) {
    console.log('Connection error:', error.message);
    process.exit(1);
  } else {
    console.log('SUCCESS: Database tables exist and are accessible!');
  }
})();
