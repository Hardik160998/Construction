const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res1 = await client.query("SELECT id, first_name, project_id FROM flate_customer WHERE flat_name='earnify'");
  console.log('Customer:', res1.rows);
  const projectId = res1.rows[0]?.project_id;
  if (projectId) {
    const res2 = await client.query("SELECT id, project_name, bhk, area_sqft FROM flate_project WHERE id=$1", [projectId]);
    console.log('Project:', res2.rows);
  } else {
    console.log('No project_id on customer');
  }
  await client.end();
}
check();
