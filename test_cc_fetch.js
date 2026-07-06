const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Hardik%408264%23@db.lexkiweqmbbxqcborzrt.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  const res = await client.query("SELECT id, tower_name, tower_id FROM commercial_customer LIMIT 5");
  console.log(res.rows);
  await client.end();
}
run().catch(console.error);
