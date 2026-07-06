const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:Hardik%408264%23@db.lexkiweqmbbxqcborzrt.supabase.co:5432/postgres' });

async function run() {
  try {
    await client.connect();
    console.log('Connected to database');

    const createSocietyProgress = `
      CREATE TABLE IF NOT EXISTS society_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tower_id UUID NOT NULL,
        floor_number INTEGER NOT NULL,
        foundation_completed BOOLEAN DEFAULT false,
        foundation_image JSONB,
        structure_completed BOOLEAN DEFAULT false,
        structure_image JSONB,
        brickwork_completed BOOLEAN DEFAULT false,
        brickwork_image JSONB,
        plastering_completed BOOLEAN DEFAULT false,
        plastering_image JSONB,
        electrical_completed BOOLEAN DEFAULT false,
        electrical_image JSONB,
        plumbing_completed BOOLEAN DEFAULT false,
        plumbing_image JSONB,
        flooring_completed BOOLEAN DEFAULT false,
        flooring_image JSONB,
        painting_completed BOOLEAN DEFAULT false,
        painting_image JSONB,
        handover_completed BOOLEAN DEFAULT false,
        handover_image JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(tower_id, floor_number)
      );
    `;

    const createCommercialProgress = `
      CREATE TABLE IF NOT EXISTS commercial_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tower_id UUID NOT NULL,
        floor_number INTEGER NOT NULL,
        foundation_completed BOOLEAN DEFAULT false,
        foundation_image JSONB,
        structure_completed BOOLEAN DEFAULT false,
        structure_image JSONB,
        brickwork_completed BOOLEAN DEFAULT false,
        brickwork_image JSONB,
        plastering_completed BOOLEAN DEFAULT false,
        plastering_image JSONB,
        electrical_completed BOOLEAN DEFAULT false,
        electrical_image JSONB,
        plumbing_completed BOOLEAN DEFAULT false,
        plumbing_image JSONB,
        flooring_completed BOOLEAN DEFAULT false,
        flooring_image JSONB,
        painting_completed BOOLEAN DEFAULT false,
        painting_image JSONB,
        handover_completed BOOLEAN DEFAULT false,
        handover_image JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(tower_id, floor_number)
      );
    `;

    await client.query(createSocietyProgress);
    console.log('Created society_progress table');
    
    await client.query(createCommercialProgress);
    console.log('Created commercial_progress table');

  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await client.end();
  }
}

run();
