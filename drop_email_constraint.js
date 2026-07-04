const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function update() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  try {
    await client.query("ALTER TABLE flate_customer DROP CONSTRAINT IF EXISTS customer_email_key");
    await client.query("ALTER TABLE society_customer DROP CONSTRAINT IF EXISTS customer_email_key");
    await client.query("ALTER TABLE commercial_customer DROP CONSTRAINT IF EXISTS customer_email_key");
    
    // Also try dropping by column name if the constraint name is different
    await client.query("ALTER TABLE flate_customer DROP CONSTRAINT IF EXISTS flate_customer_email_key");
    await client.query("ALTER TABLE society_customer DROP CONSTRAINT IF EXISTS society_customer_email_key");
    await client.query("ALTER TABLE commercial_customer DROP CONSTRAINT IF EXISTS commercial_customer_email_key");
    
    console.log('Successfully dropped unique email constraints!');
  } catch(e) {
    console.error(e);
  }
  
  await client.end();
}
update();
