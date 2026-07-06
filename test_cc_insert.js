const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Hardik%408264%23@db.lexkiweqmbbxqcborzrt.supabase.co:5432/postgres' });
async function run() {
  await client.connect();
  try {
    const res = await client.query("INSERT INTO commercial_customer (first_name, last_name, email, tower_name, flat_name, area_sqft) VALUES ('Test', 'Test', 'test2@test.com', 'Tower A', 'Shop 1', '1000') RETURNING *");
    console.log(res.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
  await client.end();
}
run().catch(console.error);
