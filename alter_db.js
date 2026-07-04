const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function update() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query("ALTER TABLE flate_project ADD COLUMN IF NOT EXISTS bhk TEXT;");
    await client.query("ALTER TABLE flate_project ADD COLUMN IF NOT EXISTS area_sqft TEXT;");
    await client.query("ALTER TABLE flate_customer ADD COLUMN IF NOT EXISTS bhk TEXT;");
    console.log('Successfully altered tables');
  } catch (error) {
    console.error('Error altering tables:', error);
  } finally {
    await client.end();
  }
}
update();
