const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function fixData() {
  if (!process.env.DATABASE_URL) return;
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    // Update Khushal to have sample floor and tower data
    await client.query(`UPDATE public.customer SET floor='10', tower_name='Tower B' WHERE email='khushalr010@gmail.com' AND floor IS NULL`);
    console.log("Customer data updated!");
  } finally {
    await client.end();
  }
}
fixData();
