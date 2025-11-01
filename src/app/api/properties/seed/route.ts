import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('📊 Starting properties seed...');

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      );
    }

    const properties = [
      {
        name: 'Vinhomes Grand Park',
        code: 'VGP',
        description: 'Mega urban area in District 9',
        address: 'Nguyễn Xiển, Long Thạnh Mỹ',
        province: 'Hồ Chí Minh',
        district: 'Thành phố Thủ Đức',
        ward: 'Long Thạnh Mỹ',
        total_area: 2710000,
        status: 'active'
      },
      {
        name: 'Vinhomes Central Park',
        code: 'VCP',
        description: 'Luxury apartments in Binh Thanh District',
        address: '208 Nguyễn Hữu Cảnh',
        province: 'Hồ Chí Minh',
        district: 'Bình Thạnh',
        ward: 'Võ Thị Sáu',
        total_area: 265000,
        status: 'active'
      },
      {
        name: 'Masteri Thảo Điền',
        code: 'MTD',
        description: 'Premium apartments in Thao Dien',
        address: '159 Xa lộ Hà Nội',
        province: 'Hồ Chí Minh',
        district: 'Quận 2',
        ward: 'Thảo Điền',
        total_area: 50000,
        status: 'active'
      },
      {
        name: 'The Sun Avenue',
        code: 'TSA',
        description: 'Modern apartment complex in District 2',
        address: '28 Mai Chí Thọ',
        province: 'Hồ Chí Minh',
        district: 'Quận 2',
        ward: 'An Phú',
        total_area: 35000,
        status: 'active'
      },
      {
        name: 'Vinhomes Ocean Park',
        code: 'VOP',
        description: 'Ocean-themed mega urban area in Hanoi',
        address: 'Đại lộ Thăng Long',
        province: 'Hà Nội',
        district: 'Gia Lâm',
        ward: 'Đa Tốn',
        total_area: 4200000,
        status: 'active'
      },
      {
        name: 'Becamex City',
        code: 'BCX',
        description: 'New urban development in Binh Duong',
        address: 'Đại lộ Bình Dương',
        province: 'Bình Dương',
        district: 'Thủ Dầu Một',
        ward: 'Phú Hòa',
        total_area: 1500000,
        status: 'active'
      }
    ];

    const { data, error } = await supabaseAdmin
      .from('properties')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(properties as any, { 
        onConflict: 'code',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('❌ Error seeding properties:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} properties`);

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      message: `Successfully seeded ${data?.length || 0} properties`
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
