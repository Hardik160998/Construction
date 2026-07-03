import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { builderId, firstName, lastName, email, phone, floor, towerName, flatName, areaSqft } = body;

    if (!builderId || !firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabaseAdmin
      .from('customer')
      .insert([
        {
          builder_id: builderId,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || null,
          floor: floor || null,
          tower_name: towerName || null,
          flat_name: flatName || null,
          area_sqft: areaSqft || null,
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error.message);
      
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A customer with this email already exists.' }, { status: 409 });
      }

      return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, customer: data[0] });
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
      .from('customer')
      .select('id, first_name, last_name, email, phone, floor, tower_name, flat_name, area_sqft, project_id, builder_id, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, customers: data || [] });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers.' }, { status: 500 });
  }
}
