const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function update() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  await client.query("UPDATE flate_tower SET number_series = '1-4' WHERE number_series = '1-10'");
  await client.query("UPDATE flate_tower SET number_series = '101-104' WHERE number_series = '101-110'");
  await client.query("UPDATE flate_tower SET number_series = '1001-1004' WHERE number_series = '1001-1010'");
  
  await client.query("UPDATE society_section SET number_series = '1-4' WHERE number_series = '1-10'");
  await client.query("UPDATE society_section SET number_series = '101-104' WHERE number_series = '101-110'");
  await client.query("UPDATE society_section SET number_series = '1001-1004' WHERE number_series = '1001-1010'");

  await client.query("UPDATE commercial_tower SET number_series = '1-4' WHERE number_series = '1-10'");
  await client.query("UPDATE commercial_tower SET number_series = '101-104' WHERE number_series = '101-110'");
  await client.query("UPDATE commercial_tower SET number_series = '1001-1004' WHERE number_series = '1001-1010'");

  console.log('Done');
  await client.end();
}
update();
