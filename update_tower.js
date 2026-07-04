const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function update() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query("UPDATE flate_tower SET number_series = '101-104' WHERE tower_name = 't1'");
  console.log('Updated', res.rowCount, 'rows');
  await client.end();
}
update();
