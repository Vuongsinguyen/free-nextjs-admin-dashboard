import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('📊 Starting building categories seed...');

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      );
    }

    const categories = [
      {
        name: 'Residential Tower',
        code: 'RES_TOWER',
        description: 'High-rise residential buildings',
        status: 'active'
      },
      {
        name: 'Commercial Complex',
        code: 'COM_COMPLEX',
        description: 'Commercial buildings with shops and offices',
        status: 'active'
      },
      {
        name: 'Mixed-use Building',
        code: 'MIXED_USE',
        description: 'Buildings with both residential and commercial spaces',
        status: 'active'
      },
      {
        name: 'Villa',
        code: 'VILLA',
        description: 'Detached villa houses',
        status: 'active'
      },
      {
        name: 'Townhouse',
        code: 'TOWNHOUSE',
        description: 'Attached townhouses',
        status: 'active'
      },
      {
        name: 'Shophouse',
        code: 'SHOPHOUSE',
        description: 'Commercial ground floor with residential upper floors',
        status: 'active'
      },
      {
        name: 'Office Building',
        code: 'OFFICE',
        description: 'Dedicated office buildings',
        status: 'active'
      },
      {
        name: 'Parking Building',
        code: 'PARKING',
        description: 'Multi-level parking structures',
        status: 'active'
      }
    ];

    const { data, error } = await supabaseAdmin
      .from('building_categories')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(categories as any, { 
        onConflict: 'code',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('❌ Error seeding building categories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} building categories`);

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      message: `Successfully seeded ${data?.length || 0} building categories`
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
