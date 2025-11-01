import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('📊 Starting zones seed...');

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      );
    }

    // First, get properties to link zones
    const { data: properties } = await supabaseAdmin
      .from('properties')
      .select('id, code');

    if (!properties || properties.length === 0) {
      return NextResponse.json(
        { error: 'No properties found. Please seed properties first.' },
        { status: 400 }
      );
    }

    const propertyMap = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      properties.map((p: any) => [p.code, p.id])
    );

    const zones = [
      // Vinhomes Grand Park zones
      {
        property_id: propertyMap['VGP'],
        name: 'The Rainbow',
        code: 'VGP_RAINBOW',
        description: 'Rainbow residential area',
        status: 'active'
      },
      {
        property_id: propertyMap['VGP'],
        name: 'The Origami',
        code: 'VGP_ORIGAMI',
        description: 'Japanese-inspired residential area',
        status: 'active'
      },
      {
        property_id: propertyMap['VGP'],
        name: 'The Manhattan',
        code: 'VGP_MANHATTAN',
        description: 'Premium residential towers',
        status: 'active'
      },
      // Vinhomes Central Park zones
      {
        property_id: propertyMap['VCP'],
        name: 'Park Zone',
        code: 'VCP_PARK',
        description: 'Park-facing apartments',
        status: 'active'
      },
      {
        property_id: propertyMap['VCP'],
        name: 'Landmark Zone',
        code: 'VCP_LANDMARK',
        description: 'Landmark tower area',
        status: 'active'
      },
      // Masteri Thảo Điền zones
      {
        property_id: propertyMap['MTD'],
        name: 'Tower A Zone',
        code: 'MTD_TOWER_A',
        description: 'Tower A residential area',
        status: 'active'
      },
      {
        property_id: propertyMap['MTD'],
        name: 'Tower B Zone',
        code: 'MTD_TOWER_B',
        description: 'Tower B residential area',
        status: 'active'
      },
      // The Sun Avenue zones
      {
        property_id: propertyMap['TSA'],
        name: 'Sun Avenue 1',
        code: 'TSA_AV1',
        description: 'Avenue 1 area',
        status: 'active'
      },
      // Vinhomes Ocean Park zones
      {
        property_id: propertyMap['VOP'],
        name: 'Aqua Bay',
        code: 'VOP_AQUA',
        description: 'Aqua Bay residential area',
        status: 'active'
      },
      {
        property_id: propertyMap['VOP'],
        name: 'Coastal Hill',
        code: 'VOP_COASTAL',
        description: 'Coastal Hill villas',
        status: 'active'
      },
      // Becamex City zones
      {
        property_id: propertyMap['BCX'],
        name: 'Central Area',
        code: 'BCX_CENTRAL',
        description: 'Central residential and commercial area',
        status: 'active'
      }
    ];

    const { data, error } = await supabaseAdmin
      .from('zones')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(zones as any, { 
        onConflict: 'code',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('❌ Error seeding zones:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} zones`);

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      message: `Successfully seeded ${data?.length || 0} zones`
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
