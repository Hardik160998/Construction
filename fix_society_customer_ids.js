const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function fixSocietyCustomerIds() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    
    console.log('Fixing builder_id in society_customer using default builder_id...');
    await client.query(`
      UPDATE society_customer 
      SET builder_id = '4f43479d-21bc-4001-b695-fb4d90591176'
      WHERE builder_id IS NULL;
    `);

    console.log('Fixing tower_id in society_customer based on tower_name and project_id...');
    await client.query(`
      UPDATE society_customer sc
      SET tower_id = t.id
      FROM society_section t
      WHERE sc.project_id::uuid = t.project_id 
        AND sc.tower_name = t.tower_name 
        AND sc.tower_id IS NULL;
    `);

    console.log('Existing records fixed.');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

fixSocietyCustomerIds();
