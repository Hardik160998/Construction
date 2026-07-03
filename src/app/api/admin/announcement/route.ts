import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  let pgClient: Client | null = null;
  try {
    const body = await request.json();
    const { projectId, title, message } = body;

    if (!projectId || !title || !message) {
      return NextResponse.json({ error: 'Project ID, title, and message are required' }, { status: 400 });
    }

    // 1. Create table if not exists using pg client
    if (process.env.DATABASE_URL) {
      pgClient = new Client({ connectionString: process.env.DATABASE_URL });
      await pgClient.connect();
      
      await pgClient.query(`
        CREATE TABLE IF NOT EXISTS public.announcement (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          project_id uuid NOT NULL REFERENCES public.project(id) ON DELETE CASCADE,
          title text NOT NULL,
          message text NOT NULL,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `);
      
      // Notify postgREST schema reload so Supabase JS client can see it immediately
      await pgClient.query(`NOTIFY pgrst, 'reload schema'`);
      await pgClient.end();
      pgClient = null;
    }

    // 2. Insert the announcement using Supabase
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabaseAdmin
      .from('announcement')
      .insert([
        {
          project_id: projectId,
          title,
          message,
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, announcement: data[0] });
  } catch (error: any) {
    console.error('API Error:', error);
    if (pgClient) {
      await pgClient.end().catch(console.error);
    }
    return NextResponse.json({ error: error.message || 'Failed to process request.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabaseAdmin
      .from('announcement')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
        // If table doesn't exist, it might throw an error code 42P01. Return empty array instead of failing.
        if (error.code === '42P01') {
            return NextResponse.json({ success: true, announcements: [] });
        }
        throw error;
    }

    return NextResponse.json({ success: true, announcements: data || [] });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements.' }, { status: 500 });
  }
}
