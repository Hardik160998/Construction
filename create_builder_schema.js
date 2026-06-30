const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createSchema() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is missing in .env.local');
    return;
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    // 1. Create builder table
    console.log('Creating builder table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.builder (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        company_name text NOT NULL,
        contact_name text NOT NULL,
        email text UNIQUE NOT NULL,
        phone text,
        project_id text,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log('Builder table created.');

    // 2. Create customer table linked to builder
    console.log('Creating customer table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.customer (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        builder_id uuid REFERENCES public.builder(id) ON DELETE CASCADE,
        first_name text NOT NULL,
        last_name text NOT NULL,
        email text UNIQUE NOT NULL,
        phone text,
        project_id text,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log('Customer table created.');

    // 3. Notify postgREST schema reload
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('Supabase Schema Cache reloaded successfully!');

  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await client.end();
  }
}

createSchema();
