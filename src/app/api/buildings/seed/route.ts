import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('📊 Starting buildings seed...');

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      );
    }

    // Get zones and building categories
    const [zonesResult, categoriesResult] = await Promise.all([
      supabaseAdmin.from('zones').select('id, code'),
      supabaseAdmin.from('building_categories').select('id, code')
    ]);

    if (!zonesResult.data || zonesResult.data.length === 0) {
      return NextResponse.json(
        { error: 'No zones found. Please seed zones first.' },
        { status: 400 }
      );
    }

    const zoneMap = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      zonesResult.data.map((z: any) => [z.code, z.id])
    );
    const categoryMap = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (categoriesResult.data || []).map((c: any) => [c.code, c.id])
    );

    const buildings = [
      // The Rainbow - VGP
      {
        zone_id: zoneMap['VGP_RAINBOW'],
        building_category_id: categoryMap['RES_TOWER'],
        name: 'S1.01',
        code: 'VGP_RAINBOW_S101',
        description: 'Rainbow tower S1.01',
        total_floors: 30,
        status: 'active'
      },
      {
        zone_id: zoneMap['VGP_RAINBOW'],
        building_category_id: categoryMap['RES_TOWER'],
        name: 'S1.02',
        code: 'VGP_RAINBOW_S102',
        description: 'Rainbow tower S1.02',
        total_floors: 30,
        status: 'active'
      },
      // The Origami - VGP
      {
        zone_id: zoneMap['VGP_ORIGAMI'],
        building_category_id: categoryMap['RES_TOWER'],
        name: 'S2.01',
        code: 'VGP_ORIGAMI_S201',
        description: 'Origami tower S2.01',
        total_floors: 35,
        status: 'active'
      },
      // The Manhattan - VGP
      {
        zone_id: zoneMap['VGP_MANHATTAN'],
        building_category_id: categoryMap['RES_TOWER'],
        name: 'M1',
        code: 'VGP_MANHATTAN_M1',
        description: 'Manhattan premium tower M1',
        total_floors: 40,
        status: 'active'
      },
      // VCP Park Zone
      {
        zone_id: zoneMap['VCP_PARK'],
        building_category_id: categoryMap['RES_TOWER'],
        name: 'Park 1',
        code: 'VCP_PARK_P1',
        description: 'Park tower 1',
        total_floors: 35,
        status: 'active'
      },
      {
        zone_id: zoneMap['VCP_PARK'],
        building_category_id: categoryMap['RES_TOWER'],
        name: 'Park 2',
        code: 'VCP_PARK_P2',
        description: 'Park tower 2',
        total_floors: 35,
        status: 'active'
      },
      // VCP Landmark
      {
        zone_id: zoneMap['VCP_LANDMARK'],
        building_category_id: categoryMap['RES_TOWER'],
        name: 'Landmark 81',
        code: 'VCP_LANDMARK_81',
        description: 'Iconic Landmark 81 tower',
        total_floors: 81,
        status: 'active'
      },
      // Masteri Thảo Điền
      {
        zone_id: zoneMap['MTD_TOWER_A'],
        building_category_id: categoryMap['RES_TOWER'],
        name: 'Tower A',
        code: 'MTD_TOWER_A',
        description: 'Masteri Tower A',
        total_floors: 25,
        status: 'active'
      },
      {
        zone_id: zoneMap['MTD_TOWER_B'],
        building_category_id: categoryMap['RES_TOWER'],
        name: 'Tower B',
        code: 'MTD_TOWER_B',
        description: 'Masteri Tower B',
        total_floors: 25,
        status: 'active'
      },
      // The Sun Avenue
      {
        zone_id: zoneMap['TSA_AV1'],
        building_category_id: categoryMap['RES_TOWER'],
        name: 'Tower 1',
        code: 'TSA_T1',
        description: 'Sun Avenue Tower 1',
        total_floors: 28,
        status: 'active'
      },
      // Vinhomes Ocean Park
      {
        zone_id: zoneMap['VOP_AQUA'],
        building_category_id: categoryMap['RES_TOWER'],
        name: 'Aqua 1',
        code: 'VOP_AQUA_1',
        description: 'Aqua Bay tower 1',
        total_floors: 32,
        status: 'active'
      },
      {
        zone_id: zoneMap['VOP_COASTAL'],
        building_category_id: categoryMap['VILLA'],
        name: 'Coastal Villa Block',
        code: 'VOP_COASTAL_V1',
        description: 'Coastal Hill villa block',
        total_floors: 3,
        status: 'active'
      },
      // Becamex City
      {
        zone_id: zoneMap['BCX_CENTRAL'],
        building_category_id: categoryMap['MIXED_USE'],
        name: 'Central Tower',
        code: 'BCX_CENTRAL_T1',
        description: 'Mixed-use central tower',
        total_floors: 20,
        status: 'active'
      }
    ];

    const { data, error } = await supabaseAdmin
      .from('buildings')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(buildings as any, { 
        onConflict: 'code',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('❌ Error seeding buildings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} buildings`);

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      message: `Successfully seeded ${data?.length || 0} buildings`
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
