const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect().then(() => client.query("SELECT id, builder_id FROM project WHERE id = 'f9dbe4ab-1d23-46c9-a397-40417f155251'")).then(res => { console.log(res.rows); client.end(); });
