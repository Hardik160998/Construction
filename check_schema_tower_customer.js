const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function getSchemas() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    let res = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'flate_tower'
    `);
    console.log('flate_tower columns:', res.rows.map(r => r.column_name));
    
    res = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'flate_customer'
    `);
    console.log('flate_customer columns:', res.rows.map(r => r.column_name));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

getSchemas();
