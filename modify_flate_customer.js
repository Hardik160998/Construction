const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Hardik%408264%23@db.lexkiweqmbbxqcborzrt.supabase.co:5432/postgres' });

async function run() {
  try {
    await client.connect();

    // Add builder_id column
    await client.query("ALTER TABLE flate_customer ADD COLUMN IF NOT EXISTS builder_id UUID");
    console.log("Added builder_id to flate_customer");

    // Add tower_id column
    await client.query("ALTER TABLE flate_customer ADD COLUMN IF NOT EXISTS tower_id UUID");
    console.log("Added tower_id to flate_customer");

    // Set builder_id to the existing builder
    await client.query("UPDATE flate_customer SET builder_id = '4f43479d-21bc-4001-b695-fb4d90591176' WHERE builder_id IS NULL");
    console.log("Updated flate_customer to have builder_id");

    // Set tower_id based on tower_name
    const updateRes = await client.query(`
      UPDATE flate_customer fc
      SET tower_id = ft.id
      FROM flate_tower ft
      WHERE fc.tower_name = ft.tower_name 
        AND fc.tower_id IS NULL;
    `);
    console.log(`Updated ${updateRes.rowCount} flate_customer records with tower_id.`);

  } catch (error) {
    console.error('Error modifying table:', error);
  } finally {
    await client.end();
  }
}

run();
