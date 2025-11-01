import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('📊 Starting property units seed...');

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      );
    }

    // Use raw query to get floor info
    const { data: floorsData } = await supabaseAdmin
      .from('floors')
      .select(`
        id,
        name,
        floor_number,
        building:buildings(
          id,
          code,
          zone:zones(
            id,
            property:properties(
              id,
              code,
              province,
              district,
              ward
            )
          )
        )
      `)
      .gt('floor_number', 1)
      .limit(30);

    if (!floorsData || floorsData.length === 0) {
      return NextResponse.json(
        { error: 'No floors found. Please seed floors first.' },
        { status: 400 }
      );
    }

    const units = [];
    const unitTypes = [
      { bedrooms: 1, bathrooms: 1, area: 45 },
      { bedrooms: 2, bathrooms: 1, area: 65 },
      { bedrooms: 2, bathrooms: 2, area: 75 },
      { bedrooms: 3, bathrooms: 2, area: 95 }
    ];

    // Generate 2-4 units per floor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const floor of floorsData as any[]) {
      const unitsPerFloor = Math.floor(Math.random() * 3) + 2; // 2-4 units
      
      for (let i = 1; i <= unitsPerFloor; i++) {
        const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
        const floorNum = String(floor.floor_number).padStart(2, '0');
        const unitNum = String(i).padStart(2, '0');
        const buildingCode = floor.building?.code || 'BLD';
        const unitCode = `${buildingCode}_${floorNum}${unitNum}`;
        
        // Get property info
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const property = (floor.building as any)?.zone?.property;
        
        units.push({
          floor_id: floor.id,
          name: `Unit ${floorNum}${unitNum}`,
          code: unitCode,
          address: property ? `${buildingCode}, Floor ${floor.floor_number}, Unit ${unitNum}` : undefined,
          province: property?.province,
          district: property?.district,
          ward: property?.ward,
          area: unitType.area,
          bedrooms: unitType.bedrooms,
          bathrooms: unitType.bathrooms,
          resident_id: null,
          resident_role: null,
          status: Math.random() > 0.3 ? 'occupied' : 'available'
        });
      }
    }

    console.log(`📊 Generated ${units.length} property units for ${floorsData.length} floors`);

    const { data, error } = await supabaseAdmin
      .from('property_units')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(units as any, { 
        onConflict: 'code',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('❌ Error seeding property units:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} property units`);

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      message: `Successfully seeded ${data?.length || 0} property units`
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
