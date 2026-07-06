const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createFloorProgressTable() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    console.log('Creating floor_progress table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.floor_progress (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        tower_id uuid NOT NULL,
        floor_number integer NOT NULL,
        foundation_completed boolean DEFAULT false,
        foundation_image text,
        structure_completed boolean DEFAULT false,
        structure_image text,
        brickwork_completed boolean DEFAULT false,
        brickwork_image text,
        plastering_completed boolean DEFAULT false,
        plastering_image text,
        electrical_completed boolean DEFAULT false,
        electrical_image text,
        plumbing_completed boolean DEFAULT false,
        plumbing_image text,
        flooring_completed boolean DEFAULT false,
        flooring_image text,
        painting_completed boolean DEFAULT false,
        painting_image text,
        handover_completed boolean DEFAULT false,
        handover_image text,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        UNIQUE(tower_id, floor_number)
      );
    `);
    
    // Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('floor_progress table created and Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

createFloorProgressTable();
