require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function createStaffTable() {
  console.log('Connecting to postgres...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    console.log('Creating staff table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.staff (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        project_id UUID REFERENCES public.project(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
      
      ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Allow public read access to staff" ON public.staff;
      DROP POLICY IF EXISTS "Allow service role full access to staff" ON public.staff;

      CREATE POLICY "Allow public read access to staff"
        ON public.staff FOR SELECT
        USING (true);

      CREATE POLICY "Allow service role full access to staff"
        ON public.staff USING (true) WITH CHECK (true);
    `);
    console.log('Successfully created staff table and RLS policies!');
  } catch (err) {
    console.error('Error creating staff table:', err);
  } finally {
    await client.end();
  }
}

createStaffTable();
