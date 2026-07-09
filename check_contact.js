const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect().then(() => client.query("SELECT * FROM information_schema.columns WHERE table_name = 'contact'")).then(res => { console.log(res.rows); client.end(); });
