const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function updateSchema() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log('Connected to database.');

    await client.query(`
      ALTER TABLE public.society_section
      ADD COLUMN IF NOT EXISTS total_houses INT,
      ADD COLUMN IF NOT EXISTS number_series TEXT;
    `);
    
    console.log('Added total_houses and number_series to society_section');
    await client.query(`NOTIFY pgrst, 'reload schema'`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

updateSchema();
