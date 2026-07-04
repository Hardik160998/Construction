const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function addColumn() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log('Connected to db, altering tables...');
    
    await client.query(`ALTER TABLE flate_customer ADD COLUMN IF NOT EXISTS flat_number VARCHAR(255);`);
    console.log('Added flat_number to flate_customer');
    
    await client.query(`ALTER TABLE society_customer ADD COLUMN IF NOT EXISTS flat_number VARCHAR(255);`);
    console.log('Added flat_number to society_customer');
    
    await client.query(`ALTER TABLE commercial_customer ADD COLUMN IF NOT EXISTS flat_number VARCHAR(255);`);
    console.log('Added flat_number to commercial_customer');

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

addColumn();
