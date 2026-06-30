const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function updateProjectTable() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    console.log('Adding new columns to project table...');
    await client.query(`
      ALTER TABLE public.project
      ADD COLUMN IF NOT EXISTS description text,
      ADD COLUMN IF NOT EXISTS cover_img_url text,
      ADD COLUMN IF NOT EXISTS expected_possession text;
    `);
    
    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('Project table updated and Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

updateProjectTable();
