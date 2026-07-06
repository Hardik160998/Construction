import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

async function getTowerTableNameByProjectId(supabaseAdmin: any, projectId: string) {
  const [f, s, c] = await Promise.all([
    supabaseAdmin.from('flate_project').select('id').eq('id', projectId).limit(1),
    supabaseAdmin.from('society_project').select('id').eq('id', projectId).limit(1),
    supabaseAdmin.from('commercial_project').select('id').eq('id', projectId).limit(1)
  ]);
  if (f.data && f.data.length > 0) return 'flate_tower';
  if (s.data && s.data.length > 0) return 'society_section';
  if (c.data && c.data.length > 0) return 'commercial_tower';
  return 'flate_tower';
}

async function getTowerTableNameByTowerId(supabaseAdmin: any, towerId: string) {
  const [f, s, c] = await Promise.all([
    supabaseAdmin.from('flate_tower').select('id').eq('id', towerId).limit(1),
    supabaseAdmin.from('society_section').select('id').eq('id', towerId).limit(1),
    supabaseAdmin.from('commercial_tower').select('id').eq('id', towerId).limit(1)
  ]);
  if (f.data && f.data.length > 0) return 'flate_tower';
  if (s.data && s.data.length > 0) return 'society_section';
  if (c.data && c.data.length > 0) return 'commercial_tower';
  return 'flate_tower';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, towerName, totalFloors, totalHouses, numberSeries, bhk, towerType, unitTypes } = body;

    if (!projectId || !towerName || (!totalFloors && !totalHouses)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const tableName = await getTowerTableNameByProjectId(supabaseAdmin, projectId);

    const payload: any = {
      project_id: projectId,
      tower_name: towerName,
    };
    if (totalFloors) payload.total_floors = parseInt(totalFloors, 10);
    if (totalHouses) payload.total_houses = parseInt(totalHouses, 10);
    if (numberSeries) payload.number_series = numberSeries;
    if (bhk) payload.bhk = bhk;
    if (towerType && tableName === 'commercial_tower') payload.tower_type = towerType;
    if (unitTypes && tableName === 'commercial_tower') payload.unit_types = unitTypes;

    const { data, error } = await supabaseAdmin
      .from(tableName)
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, tower: data[0] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const id = searchParams.get('id');
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    if (id) {
      const tableName = await getTowerTableNameByTowerId(supabaseAdmin, id);
      const { data, error } = await supabaseAdmin.from(tableName).select('*').eq('id', id).single();
      if (error) throw error;
      return NextResponse.json({ success: true, towers: [data] });
    } 
    
    if (projectId) {
      const tableName = await getTowerTableNameByProjectId(supabaseAdmin, projectId);
      const { data, error } = await supabaseAdmin.from(tableName).select('*').eq('project_id', projectId).order('created_at', { ascending: true });
      if (error) throw error;
      return NextResponse.json({ success: true, towers: data || [] });
    }

    // Fetch all towers from all tables
    const [f, s, c] = await Promise.all([
      supabaseAdmin.from('flate_tower').select('*'),
      supabaseAdmin.from('society_section').select('*'),
      supabaseAdmin.from('commercial_tower').select('*')
    ]);

    const allTowers = [
      ...(f.data || []),
      ...(s.data || []),
      ...(c.data || [])
    ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return NextResponse.json({ success: true, towers: allTowers });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch towers.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Missing tower id or updates payload' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const tableName = await getTowerTableNameByTowerId(supabaseAdmin, id);

    const { data, error } = await supabaseAdmin
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, tower: data[0] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update tower.' }, { status: 500 });
  }
}
