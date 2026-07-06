const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Hardik%408264%23@db.lexkiweqmbbxqcborzrt.supabase.co:5432/postgres' });

async function run() {
  try {
    await client.connect();
    
    // Drop customer_id column
    await client.query("ALTER TABLE society_section DROP COLUMN IF EXISTS customer_id");
    console.log("Dropped customer_id from society_section");

    // Add builder_id column
    await client.query("ALTER TABLE society_section ADD COLUMN IF NOT EXISTS builder_id UUID");
    console.log("Added builder_id to society_section");

    // Set builder_id to the existing builder
    await client.query("UPDATE society_section SET builder_id = '4f43479d-21bc-4001-b695-fb4d90591176' WHERE builder_id IS NULL");
    console.log("Updated society_section to have builder_id");

  } catch (error) {
    console.error('Error modifying table:', error);
  } finally {
    await client.end();
  }
}

run();
