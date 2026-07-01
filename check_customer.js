const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkData() {
  if (!process.env.DATABASE_URL) return;
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query(`SELECT * FROM public.customer WHERE email='khushalr010@gmail.com'`);
    console.log("Customer data:", res.rows[0]);
  } finally {
    await client.end();
  }
}
checkData();
