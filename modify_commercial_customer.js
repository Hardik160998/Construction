const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Hardik%408264%23@db.lexkiweqmbbxqcborzrt.supabase.co:5432/postgres' });

async function run() {
  try {
    await client.connect();
    
    // Add builder_id column
    await client.query("ALTER TABLE commercial_customer ADD COLUMN IF NOT EXISTS builder_id UUID");
    console.log("Added builder_id to commercial_customer");

    // Add tower_id column
    await client.query("ALTER TABLE commercial_customer ADD COLUMN IF NOT EXISTS tower_id UUID");
    console.log("Added tower_id to commercial_customer");

    // Set builder_id to the existing builder
    await client.query("UPDATE commercial_customer SET builder_id = '4f43479d-21bc-4001-b695-fb4d90591176' WHERE builder_id IS NULL");
    console.log("Updated commercial_customer to have builder_id");

  } catch (error) {
    console.error('Error modifying table:', error);
  } finally {
    await client.end();
  }
}

run();
