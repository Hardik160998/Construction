const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function addTowerProgressColumns() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    const phases = [
      'foundation',
      'structure',
      'brickwork',
      'plastering',
      'electrical',
      'plumbing',
      'flooring',
      'painting',
      'handover'
    ];

    console.log('Adding progress columns to tower table...');
    
    for (const phase of phases) {
      await client.query(`
        ALTER TABLE public.tower 
        ADD COLUMN IF NOT EXISTS ${phase}_completed boolean DEFAULT false,
        ADD COLUMN IF NOT EXISTS ${phase}_image text;
      `);
    }

    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('Columns added and Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

addTowerProgressColumns();
