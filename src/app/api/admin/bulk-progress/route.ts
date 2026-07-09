import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

const phases = [
  'foundation', 'structure', 'brickwork', 'plastering', 
  'electrical', 'plumbing', 'flooring', 'painting', 'handover'
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const towerId = searchParams.get('towerId');
    const projectType = searchParams.get('projectType') || 'Flat';

    if (!towerId) {
      return NextResponse.json({ error: 'Missing towerId' }, { status: 400 });
    }

    let tableName = 'floor_progress';
    if (projectType === 'Society') tableName = 'society_progress';
    else if (projectType === 'Commercial') tableName = 'commercial_progress';

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .eq('tower_id', towerId);

    if (error) {
      throw error;
    }

    // Calculate percentage per floor
    const progressMap: Record<number, number> = {};
    if (data) {
      data.forEach((row: any) => {
        let completed = 0;
        phases.forEach(p => {
          if (row[`${p}_completed`]) completed++;
        });
        progressMap[row.floor_number] = Math.round((completed / phases.length) * 100);
      });
    }

    return NextResponse.json({ success: true, progressMap, data });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch bulk progress.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { towers, projectType = 'Flat' } = body;

    if (!towers || !Array.isArray(towers) || towers.length === 0) {
      return NextResponse.json({ success: true, towerProgressMap: {} });
    }

    const towerIds = towers.map((t: any) => t.id);

    let tableName = 'floor_progress';
    if (projectType === 'Society') tableName = 'society_progress';
    else if (projectType === 'Commercial') tableName = 'commercial_progress';

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .in('tower_id', towerIds);

    if (error) {
      throw error;
    }

    // Calculate average percentage per tower based on total capacity
    const towerProgressMap: Record<string, number> = {};
    if (data) {
      const towerStats: Record<string, number> = {};
      
      data.forEach((row: any) => {
        let completed = 0;
        phases.forEach(p => {
          if (row[`${p}_completed`]) completed++;
        });
        const floorPercentage = (completed / phases.length) * 100;
        
        if (!towerStats[row.tower_id]) {
          towerStats[row.tower_id] = 0;
        }
        towerStats[row.tower_id] += floorPercentage;
      });

      for (const tower of towers) {
        const tId = tower.id;
        const totalPercentage = towerStats[tId] || 0;
        
        let capacity = 0;
        if (tower.number_series) {
          const parts = tower.number_series.split(',');
          parts.forEach((part: string) => {
            if (part.includes('-')) {
              const [start, end] = part.split('-').map(Number);
              if (!isNaN(start) && !isNaN(end)) {
                capacity += (end - start + 1);
              }
            } else {
              if (!isNaN(Number(part))) capacity++;
            }
          });
        }
        
        if (capacity === 0) {
          capacity = tower.total_floors || tower.total_houses || 1;
        }
        
        // divide the sum of all floor percentages by the actual total capacity of the tower
        towerProgressMap[tId] = Math.round(totalPercentage / capacity);
      }
    }

    return NextResponse.json({ success: true, towerProgressMap });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch bulk progress.' }, { status: 500 });
  }
}
