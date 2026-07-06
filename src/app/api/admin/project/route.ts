import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, location, status, description, coverImgUrl, expectedPossession, builderId, projectType, googleMapUrl } = body;

    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const payload: any = {
      p_name: projectName,
      location: location || null,
      status: status || null,
      descri: description || null,
      image: coverImgUrl || null,
      possesion: expectedPossession || null,
      builder_id: builderId || null,
      pro_type: projectType || null,
      google_map: googleMapUrl || null,
    };

    const { data, error } = await supabaseAdmin
      .from('project')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500 });
    }

    const dbProject = data[0];
    const project = {
      id: dbProject.id,
      project_name: dbProject.p_name,
      location: dbProject.location,
      status: dbProject.status,
      description: dbProject.descri,
      cover_img_url: dbProject.image,
      expected_possession: dbProject.possesion,
      builder_id: dbProject.builder_id,
      project_type: dbProject.pro_type,
      google_map: dbProject.google_map,
      created_at: dbProject.created_at
    };

    return NextResponse.json({ success: true, project: project });
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

    const { data: projects, error } = await supabaseAdmin
      .from('project')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mappedProjects = (projects || []).map(p => ({
      id: p.id,
      project_name: p.p_name,
      location: p.location,
      status: p.status,
      description: p.descri,
      cover_img_url: p.image,
      expected_possession: p.possesion,
      builder_id: p.builder_id,
      project_type: p.pro_type,
      google_map: p.google_map,
      created_at: p.created_at
    }));

    return NextResponse.json({ success: true, projects: mappedProjects });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects.' }, { status: 500 });
  }
}
