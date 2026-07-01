const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createTowerTable() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    console.log('Creating tower table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.tower (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        project_id uuid NOT NULL REFERENCES public.project(id) ON DELETE CASCADE,
        tower_name text NOT NULL,
        total_floors integer NOT NULL,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    
    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('Tower table created and Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

createTowerTable();
