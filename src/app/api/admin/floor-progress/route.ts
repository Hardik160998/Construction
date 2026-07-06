import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const towerId = searchParams.get('towerId');
    const floorNumber = searchParams.get('floorNumber');

    if (!towerId || !floorNumber) {
      return NextResponse.json({ error: 'Missing towerId or floorNumber' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    let { data, error } = await supabaseAdmin
      .from('floor_progress')
      .select('*')
      .eq('tower_id', towerId)
      .eq('floor_number', parseInt(floorNumber, 10))
      .single();

    if (error && error.code === 'PGRST116') {
      // Row not found, create it on the fly
      const { data: newRow, error: insertError } = await supabaseAdmin
        .from('floor_progress')
        .insert([{ tower_id: towerId, floor_number: parseInt(floorNumber, 10) }])
        .select()
        .single();
        
      if (insertError) {
        throw insertError;
      }
      data = newRow;
    } else if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, progress: data });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch floor progress.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { towerId, floorNumber, updates } = body;

    if (!towerId || floorNumber === undefined || !updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Missing towerId, floorNumber, or updates payload' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabaseAdmin
      .from('floor_progress')
      .update(updates)
      .eq('tower_id', towerId)
      .eq('floor_number', parseInt(floorNumber, 10))
      .select();

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, progress: data[0] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to update floor progress.' }, { status: 500 });
  }
}
