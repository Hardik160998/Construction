const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function update() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  try {
    await client.query("ALTER TABLE society_project ADD COLUMN IF NOT EXISTS room_number VARCHAR(50);");
    console.log('Added room_number to society_project');
  } catch(e) {
    console.error(e);
  }
  
  await client.end();
}
update();
