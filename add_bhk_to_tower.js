const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function update() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  try {
    await client.query("ALTER TABLE flate_tower ADD COLUMN IF NOT EXISTS bhk VARCHAR(50);");
    await client.query("ALTER TABLE society_section ADD COLUMN IF NOT EXISTS bhk VARCHAR(50);");
    await client.query("ALTER TABLE commercial_tower ADD COLUMN IF NOT EXISTS bhk VARCHAR(50);");
    console.log('Added bhk to tower tables');
  } catch(e) {
    console.error(e);
  }
  
  await client.end();
}
update();
