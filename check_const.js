const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Hardik%408264%23@db.lexkiweqmbbxqcborzrt.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  const res = await client.query("SELECT constraint_name, constraint_type FROM information_schema.table_constraints WHERE table_name = 'commercial_customer'");
  console.log(res.rows);
  await client.end();
}
run().catch(console.error);
