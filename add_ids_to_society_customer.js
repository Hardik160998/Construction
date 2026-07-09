const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function updateSocietyCustomer() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    console.log('Adding builder_id, project_id, tower_id to society_customer table...');
    await client.query(`
      ALTER TABLE public.society_customer 
      ADD COLUMN IF NOT EXISTS builder_id uuid,
      ADD COLUMN IF NOT EXISTS project_id uuid,
      ADD COLUMN IF NOT EXISTS tower_id uuid;
    `);
    
    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('Columns added successfully and schema cache reloaded!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

updateSocietyCustomer();
