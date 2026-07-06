const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function migrate() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log('Connected to DB!');
    
    // Create new table
    await client.query(`
      CREATE TABLE IF NOT EXISTS project (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          p_name TEXT NOT NULL,
          location TEXT,
          status TEXT,
          descri TEXT,
          image TEXT,
          possesion TEXT,
          pro_type TEXT,
          builder_id UUID,
          google_map TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Created project table');

    // Move flat projects
    const flats = await client.query(`SELECT * FROM flate_project`);
    for (const f of flats.rows) {
      await client.query(
        `INSERT INTO project (id, p_name, location, status, descri, image, possesion, pro_type, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
        [f.id, f.project_name, f.location, f.status, f.description, f.cover_img_url, f.expected_possession, f.project_type, f.created_at]
      );
    }
    console.log('Migrated flats');

    // Move society projects
    const socs = await client.query(`SELECT * FROM society_project`);
    for (const f of socs.rows) {
      await client.query(
        `INSERT INTO project (id, p_name, location, status, descri, image, possesion, pro_type, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
        [f.id, f.project_name, f.location, f.status, f.description, f.cover_img_url, f.expected_possession, f.project_type, f.created_at]
      );
    }
    console.log('Migrated societies');

    // Move commercial projects
    const comms = await client.query(`SELECT * FROM commercial_project`);
    for (const f of comms.rows) {
      await client.query(
        `INSERT INTO project (id, p_name, location, status, descri, image, possesion, pro_type, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
        [f.id, f.project_name, f.location, f.status, f.description, f.cover_img_url, f.expected_possession, f.project_type, f.created_at]
      );
    }
    console.log('Migrated commercials');

    // Drop old tables
    await client.query(`DROP TABLE IF EXISTS flate_project CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS society_project CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS commercial_project CASCADE;`);
    console.log('Dropped old tables');
    
  } catch(e) { console.error(e); }
  finally { await client.end(); }
}
migrate();
