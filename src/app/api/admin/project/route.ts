import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, location, status, description, coverImgUrl, expectedPossession, customerId } = body;

    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabaseAdmin
      .from('project')
      .insert([
        {
          project_name: projectName,
          location: location || null,
          status: status || null,
          description: description || null,
          cover_img_url: coverImgUrl || null,
          expected_possession: expectedPossession || null,
          customer_id: customerId || null,
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: data[0] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabaseAdmin
      .from('project')
      .select('id, project_name, location, status, description, cover_img_url, expected_possession, customer_id, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, projects: data || [] });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects.' }, { status: 500 });
  }
}
