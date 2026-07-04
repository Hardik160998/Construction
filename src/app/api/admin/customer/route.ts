import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

async function getCustomerTableNameByProjectId(supabaseAdmin: any, projectId: string) {
  const [f, s, c] = await Promise.all([
    supabaseAdmin.from('flate_project').select('id').eq('id', projectId).limit(1),
    supabaseAdmin.from('society_project').select('id').eq('id', projectId).limit(1),
    supabaseAdmin.from('commercial_project').select('id').eq('id', projectId).limit(1)
  ]);
  if (f.data && f.data.length > 0) return 'flate_customer';
  if (s.data && s.data.length > 0) return 'society_customer';
  if (c.data && c.data.length > 0) return 'commercial_customer';
  return 'flate_customer';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { builderId, projectId, customerType, firstName, lastName, email, phone, floor, towerName, flatName, flatNumber, areaSqft, bhk } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    let tableName = 'flate_customer';
    if (customerType === 'Society') tableName = 'society_customer';
    else if (customerType === 'Commercial') tableName = 'commercial_customer';
    else if (customerType === 'Flat') tableName = 'flate_customer';
    else if (projectId) {
      tableName = await getCustomerTableNameByProjectId(supabaseAdmin, projectId);
    }

    const payload: any = {
      builder_id: builderId || null,
      project_id: projectId || null,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone || null,
      floor: floor || null,
      tower_name: towerName || null,
      flat_name: flatName || null,
      flat_number: flatNumber || null,
      area_sqft: areaSqft || null,
    };

    if (tableName === 'flate_customer') {
      payload.bhk = bhk || null;
    }

    const { data, error } = await supabaseAdmin
      .from(tableName)
      .insert([payload])
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

    const [f, s, c] = await Promise.all([
      supabaseAdmin.from('flate_customer').select('id, first_name, last_name, email, phone, floor, tower_name, flat_name, flat_number, area_sqft, project_id, builder_id, created_at'),
      supabaseAdmin.from('society_customer').select('id, first_name, last_name, email, phone, floor, tower_name, flat_name, flat_number, area_sqft, project_id, builder_id, created_at'),
      supabaseAdmin.from('commercial_customer').select('id, first_name, last_name, email, phone, floor, tower_name, flat_name, flat_number, area_sqft, project_id, builder_id, created_at')
    ]);

    const allCustomers = [
      ...(f.data || []),
      ...(s.data || []),
      ...(c.data || [])
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, customers: allCustomers });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers.' }, { status: 500 });
  }
}
