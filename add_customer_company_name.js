const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function addCompanyNameToCustomer() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    console.log('Adding company_name column to customer table...');
    await client.query(`
      ALTER TABLE public.customer 
      ADD COLUMN IF NOT EXISTS company_name text;
    `);
    
    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('company_name column added to customer and Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

addCompanyNameToCustomer();
