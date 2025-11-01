import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('📊 Starting floors seed...');

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      );
    }

    // Get buildings
    const { data: buildings } = await supabaseAdmin
      .from('buildings')
      .select('id, code, total_floors');

    if (!buildings || buildings.length === 0) {
      return NextResponse.json(
        { error: 'No buildings found. Please seed buildings first.' },
        { status: 400 }
      );
    }

    const floors = [];
    
    // Generate floors for each building
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const building of buildings as any[]) {
      const totalFloors = building.total_floors || 10;
      
      // For high-rise buildings (>20 floors), sample every 5th floor
      // For smaller buildings, create all floors
      const shouldSample = totalFloors > 20;
      
      for (let i = 1; i <= totalFloors; i++) {
        if (shouldSample && i % 5 !== 0 && i !== 1 && i !== totalFloors) {
          continue; // Skip floors to avoid too many records
        }
        
        floors.push({
          building_id: building.id,
          name: `Floor ${i}`,
          floor_number: i,
          description: i === 1 ? 'Ground floor' : i === totalFloors ? 'Top floor' : `Level ${i}`,
          total_units: i === 1 ? 0 : 8, // Ground floor typically has no units
          status: 'active'
        });
      }
    }

    console.log(`📊 Generated ${floors.length} floors for ${buildings.length} buildings`);

    const { data, error } = await supabaseAdmin
      .from('floors')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(floors as any, { 
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('❌ Error seeding floors:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} floors`);

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      message: `Successfully seeded ${data?.length || 0} floors`
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
