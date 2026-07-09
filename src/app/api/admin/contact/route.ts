import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data: contacts, error } = await supabaseAdmin
      .from('contact')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, contacts: contacts || [] });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts.' }, { status: 500 });
  }
}
