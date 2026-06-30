import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    const { data, error } = await supabaseAdmin
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

    if (error) {
      console.error('Supabase Error:', error.message);
      
      // Handle unique email constraint error natively
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A builder with this email already exists.' }, { status: 409 });
      }

      return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, builder: data[0] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
