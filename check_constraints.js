const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query("SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'flate_customer'::regclass");
  console.log(res.rows);
  await client.end();
}
check();
