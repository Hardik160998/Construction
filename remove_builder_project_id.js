const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function removeProjectIdFromBuilder() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    console.log('Removing project_id column from builder table...');
    await client.query(`
      ALTER TABLE public.builder 
      DROP COLUMN IF EXISTS project_id;
    `);
    
    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('project_id column removed and Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

removeProjectIdFromBuilder();
