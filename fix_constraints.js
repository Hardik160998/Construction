const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function fixConstraints() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log('Connected to database.');

    await client.query(`
      ALTER TABLE public.society_section ALTER COLUMN total_floors DROP NOT NULL;
    `);
    
    console.log('Dropped NOT NULL constraint on total_floors for society_section');
    await client.query(`NOTIFY pgrst, 'reload schema'`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

fixConstraints();
