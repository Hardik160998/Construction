const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function addFloorAndTowerToCustomer() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    console.log('Adding floor and tower_name columns to customer table...');
    await client.query(`
      ALTER TABLE public.customer 
      ADD COLUMN IF NOT EXISTS floor text,
      ADD COLUMN IF NOT EXISTS tower_name text;
    `);
    
    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('Columns added to customer and Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

addFloorAndTowerToCustomer();
