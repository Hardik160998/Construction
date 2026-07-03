const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createTables() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    const queries = [
      'CREATE TABLE IF NOT EXISTS public.commercial_customer (LIKE public.flate_customer INCLUDING ALL);',
      'CREATE TABLE IF NOT EXISTS public.society_customer (LIKE public.flate_customer INCLUDING ALL);',
      'CREATE TABLE IF NOT EXISTS public.commercial_tower (LIKE public.flate_tower INCLUDING ALL);',
      'CREATE TABLE IF NOT EXISTS public.society_section (LIKE public.flate_tower INCLUDING ALL);'
    ];

    for (const q of queries) {
      await client.query(q);
      console.log('Executed:', q);
    }

    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

createTables();
