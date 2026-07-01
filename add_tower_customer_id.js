const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function addCustomerIdToTower() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    console.log('Adding customer_id column to tower table...');
    await client.query(`
      ALTER TABLE public.tower 
      ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customer(id) ON DELETE SET NULL;
    `);
    
    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('customer_id column added to tower and Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

addCustomerIdToTower();
