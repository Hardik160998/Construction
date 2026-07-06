const { Client } = require('pg'); 
const client = new Client({ connectionString: 'postgresql://postgres:Hardik%408264%23@db.lexkiweqmbbxqcborzrt.supabase.co:5432/postgres' }); 
async function run() { 
  await client.connect(); 
  const res = await client.query("UPDATE project SET builder_id = '4f43479d-21bc-4001-b695-fb4d90591176' WHERE builder_id IS NULL"); 
  console.log('Updated projects:', res.rowCount); 
  await client.end(); 
} 
run().catch(console.error);
