const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function addFlatAndAreaToCustomer() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    console.log('Adding flat_name and area_sqft columns to customer table...');
    await client.query(`
      ALTER TABLE public.customer 
      ADD COLUMN IF NOT EXISTS flat_name text,
      ADD COLUMN IF NOT EXISTS area_sqft text;
    `);
    
    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('flat_name and area_sqft columns added to customer and Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

addFlatAndAreaToCustomer();
