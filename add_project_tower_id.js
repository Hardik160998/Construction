const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function addTowerIdToProject() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    console.log('Adding tower_id column to project table...');
    await client.query(`
      ALTER TABLE public.project 
      ADD COLUMN IF NOT EXISTS tower_id uuid REFERENCES public.tower(id) ON DELETE SET NULL;
    `);
    
    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('tower_id column added to project and Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

addTowerIdToProject();
