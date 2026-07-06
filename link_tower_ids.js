const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Hardik%408264%23@db.lexkiweqmbbxqcborzrt.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  try {
    // Update commercial_customer
    const updateRes = await client.query(`
      UPDATE commercial_customer cc
      SET tower_id = ct.id
      FROM commercial_tower ct
      WHERE cc.tower_name = ct.tower_name 
        AND cc.tower_id IS NULL;
    `);
    console.log(`Updated ${updateRes.rowCount} commercial_customer records.`);

    // Similarly update flate_customer if applicable
    const updateFlate = await client.query(`
      UPDATE flate_customer fc
      SET tower_id = ft.id
      FROM flate_tower ft
      WHERE fc.tower_name = ft.tower_name 
        AND fc.tower_id IS NULL;
    `);
    console.log(`Updated ${updateFlate.rowCount} flate_customer records.`);
    
    // Similarly update society_customer if applicable
    const updateSociety = await client.query(`
      UPDATE society_customer sc
      SET tower_id = ss.id
      FROM society_section ss
      WHERE sc.tower_name = ss.tower_name 
        AND sc.tower_id IS NULL;
    `);
    console.log(`Updated ${updateSociety.rowCount} society_customer records.`);

  } catch (err) {
    console.error(err);
  }
  await client.end();
}
run().catch(console.error);
