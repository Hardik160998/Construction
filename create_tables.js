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

    console.log('Creating society_project table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.society_project (LIKE public.flate_project INCLUDING ALL);
    `);
    console.log('society_project created.');

    console.log('Creating commercial_project table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.commercial_project (LIKE public.flate_project INCLUDING ALL);
    `);
    console.log('commercial_project created.');

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
