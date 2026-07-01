import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabaseAdmin
      .from('builder')
      .select('id, company_name, contact_name, email, phone, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, builders: data });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch builders' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, contactName, email, phone } = body;

    if (!companyName || !contactName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    let { data, error } = await supabaseAdmin
      .from('builder')
      .insert([
        {
          company_name: companyName,
          contact_name: contactName,
          email: email,
          phone: phone || null,
        }
      ])
      .select();

    const isTableMissing = error && (error.code === '42P01' || error.message.includes('Could not find the table'));

    if (isTableMissing) {
      if (!process.env.DATABASE_URL) {
        return NextResponse.json({ 
          error: 'Database table is not created yet. Please add DATABASE_URL to your .env.local file so the system can auto-create it.' 
        }, { status: 500 });
      }

      console.log('Builder table missing. Attempting to auto-create using pg...');
      const { Client } = require('pg');
      const client = new Client({ connectionString: process.env.DATABASE_URL });
      
      try {
        await client.connect();
        
        // 1. Create builder table
        await client.query(`
          CREATE TABLE IF NOT EXISTS public.builder (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            company_name text NOT NULL,
            contact_name text NOT NULL,
            email text UNIQUE NOT NULL,
            phone text,
            created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
          );
        `);
        
        // 2. Create customer table linked to builder
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
        
        // Notify Supabase to reload its schema cache
        await client.query(`NOTIFY pgrst, 'reload schema'`);

        console.log('Tables created successfully. Retrying insert...');
        
        // Retry the insert after creating the table
        const retry = await supabaseAdmin
          .from('builder')
          .insert([
            {
              company_name: companyName,
              contact_name: contactName,
              email: email,
              phone: phone || null,
            }
          ])
          .select();
          
        error = retry.error;
        data = retry.data;
      } catch (err: any) {
        console.error('Failed to auto-create tables:', err);
        return NextResponse.json({ error: `Failed to auto-create table: ${err.message}` }, { status: 500 });
      } finally {
        await client.end();
      }
    }

    if (error) {
      console.error('Supabase Error:', error.message);
      
      // Handle unique email constraint error natively
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A builder with this email already exists.' }, { status: 409 });
      }

      return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, builder: data ? data[0] : null });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
