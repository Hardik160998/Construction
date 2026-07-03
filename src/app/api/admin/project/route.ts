import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, location, status, description, coverImgUrl, expectedPossession, customerId, projectType } = body;

    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    let tableName = 'flate_project';
    if (projectType === 'Society') {
      tableName = 'society_project';
    } else if (projectType === 'Commercial') {
      tableName = 'commercial_project';
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabaseAdmin
      .from(tableName)
      .insert([
        {
          project_name: projectName,
          location: location || null,
          status: status || null,
          description: description || null,
          cover_img_url: coverImgUrl || null,
          expected_possession: expectedPossession || null,
          customer_id: customerId || null,
          project_type: projectType || null,
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

    const [flats, societies, commercials] = await Promise.all([
      supabaseAdmin.from('flate_project').select('id, project_name, location, status, description, cover_img_url, expected_possession, customer_id, project_type, created_at'),
      supabaseAdmin.from('society_project').select('id, project_name, location, status, description, cover_img_url, expected_possession, customer_id, project_type, created_at'),
      supabaseAdmin.from('commercial_project').select('id, project_name, location, status, description, cover_img_url, expected_possession, customer_id, project_type, created_at')
    ]);

    if (flats.error) throw flats.error;
    if (societies.error) throw societies.error;
    if (commercials.error) throw commercials.error;

    const allProjects = [
      ...(flats.data || []),
      ...(societies.data || []),
      ...(commercials.data || [])
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, projects: allProjects });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects.' }, { status: 500 });
  }
}
