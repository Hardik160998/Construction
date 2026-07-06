const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Hardik%408264%23@db.lexkiweqmbbxqcborzrt.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  const dropCols = `
    ALTER TABLE flate_tower 
    DROP COLUMN IF EXISTS foundation_completed, DROP COLUMN IF EXISTS foundation_image,
    DROP COLUMN IF EXISTS structure_completed, DROP COLUMN IF EXISTS structure_image,
    DROP COLUMN IF EXISTS brickwork_completed, DROP COLUMN IF EXISTS brickwork_image,
    DROP COLUMN IF EXISTS plastering_completed, DROP COLUMN IF EXISTS plastering_image,
    DROP COLUMN IF EXISTS electrical_completed, DROP COLUMN IF EXISTS electrical_image,
    DROP COLUMN IF EXISTS plumbing_completed, DROP COLUMN IF EXISTS plumbing_image,
    DROP COLUMN IF EXISTS flooring_completed, DROP COLUMN IF EXISTS flooring_image,
    DROP COLUMN IF EXISTS painting_completed, DROP COLUMN IF EXISTS painting_image,
    DROP COLUMN IF EXISTS handover_completed, DROP COLUMN IF EXISTS handover_image;
  `;
  await client.query(dropCols);
  console.log('Columns dropped from flate_tower successfully');
  await client.end();
}
run().catch(console.error);
