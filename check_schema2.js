const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'flate_project'");
  console.log('Project Columns:', res.rows.map(r => r.column_name));
  const res2 = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'flate_customer'");
  console.log('Customer Columns:', res2.rows.map(r => r.column_name));
  await client.end();
}
check();
