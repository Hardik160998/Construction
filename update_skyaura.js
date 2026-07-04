const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function update() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query("UPDATE flate_tower SET number_series = '1001-1004' WHERE tower_name = 'skyaura1-A'");
  console.log('Updated:', res.rowCount);
  await client.end();
}
update();
