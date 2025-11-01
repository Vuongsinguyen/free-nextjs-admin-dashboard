/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // First, get or create Vietnam country
    let vietnam = null;
    const { data: existingVietnam, error: countryErr } = await supabase
      .from('countries')
      .select('id')
      .eq('code', 'VN')
      .single();

    if (countryErr || !existingVietnam) {
      // Create Vietnam if not exists
      const { data: newCountry, error: createErr } = await (supabase as any)
        .from('countries')
        .insert({
          code: 'VN',
          name: 'Việt Nam',
          name_en: 'Vietnam',
          phone_code: '+84',
          currency: 'VND',
          status: 'active'
        })
        .select('id')
        .single();

      if (createErr) {
        return NextResponse.json({ error: 'Failed to create Vietnam country', details: createErr.message }, { status: 500 });
      }
      vietnam = newCountry;
    } else {
      vietnam = existingVietnam;
    }

    if (!vietnam) {
      return NextResponse.json({ error: 'Failed to get/create Vietnam country' }, { status: 500 });
    }

    const vietnamId = (vietnam as any).id;

    // 34 provinces matching the schema
    const provinces = [
      { code: '11', name: 'Hà Nội', name_en: 'Ha Noi', type: 'city' },
      { code: '12', name: 'Hồ Chí Minh', name_en: 'Ho Chi Minh', type: 'city' },
      { code: '13', name: 'Đà Nẵng', name_en: 'Da Nang', type: 'city' },
      { code: '14', name: 'Hải Phòng', name_en: 'Hai Phong', type: 'city' },
      { code: '15', name: 'Cần Thơ', name_en: 'Can Tho', type: 'city' },
      { code: '16', name: 'Huế', name_en: 'Hue', type: 'city' },
      { code: '17', name: 'An Giang', name_en: 'An Giang', type: 'province' },
      { code: '18', name: 'Bắc Ninh', name_en: 'Bac Ninh', type: 'province' },
      { code: '19', name: 'Cà Mau', name_en: 'Ca Mau', type: 'province' },
      { code: '20', name: 'Cao Bằng', name_en: 'Cao Bang', type: 'province' },
      { code: '21', name: 'Đắk Lắk', name_en: 'Dak Lak', type: 'province' },
      { code: '22', name: 'Điện Biên', name_en: 'Dien Bien', type: 'province' },
      { code: '23', name: 'Đồng Nai', name_en: 'Dong Nai', type: 'province' },
      { code: '24', name: 'Đồng Tháp', name_en: 'Dong Thap', type: 'province' },
      { code: '25', name: 'Gia Lai', name_en: 'Gia Lai', type: 'province' },
      { code: '26', name: 'Hà Tĩnh', name_en: 'Ha Tinh', type: 'province' },
      { code: '27', name: 'Hưng Yên', name_en: 'Hung Yen', type: 'province' },
      { code: '28', name: 'Khánh Hòa', name_en: 'Khanh Hoa', type: 'province' },
      { code: '29', name: 'Lai Châu', name_en: 'Lai Chau', type: 'province' },
      { code: '30', name: 'Lâm Đồng', name_en: 'Lam Dong', type: 'province' },
      { code: '31', name: 'Lạng Sơn', name_en: 'Lang Son', type: 'province' },
      { code: '32', name: 'Lào Cai', name_en: 'Lao Cai', type: 'province' },
      { code: '33', name: 'Nghệ An', name_en: 'Nghe An', type: 'province' },
      { code: '34', name: 'Ninh Bình', name_en: 'Ninh Binh', type: 'province' },
      { code: '35', name: 'Phú Thọ', name_en: 'Phu Tho', type: 'province' },
      { code: '36', name: 'Quảng Ngãi', name_en: 'Quang Ngai', type: 'province' },
      { code: '37', name: 'Quảng Ninh', name_en: 'Quang Ninh', type: 'province' },
      { code: '38', name: 'Quảng Trị', name_en: 'Quang Tri', type: 'province' },
      { code: '39', name: 'Sơn La', name_en: 'Son La', type: 'province' },
      { code: '40', name: 'Tây Ninh', name_en: 'Tay Ninh', type: 'province' },
      { code: '41', name: 'Thái Nguyên', name_en: 'Thai Nguyen', type: 'province' },
      { code: '42', name: 'Thanh Hóa', name_en: 'Thanh Hoa', type: 'province' },
      { code: '43', name: 'Tiền Giang', name_en: 'Tien Giang', type: 'province' },
      { code: '44', name: 'Vĩnh Long', name_en: 'Vinh Long', type: 'province' },
    ];

    const provincesData = provinces.map(p => ({
      country_id: vietnamId,
      code: p.code,
      name: p.name,
      name_en: p.name_en,
      type: p.type as 'city' | 'province',
      status: 'active' as const
    }));

    const { error: insertErr, count } = await (supabase as any)
      .from('provinces')
      .upsert(provincesData, { onConflict: 'code', count: 'exact' });

    if (insertErr) {
      return NextResponse.json({ error: 'Failed to seed provinces', details: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Provinces seeded successfully',
      vietnamId,
      provincesCount: count 
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Unexpected error', details: message }, { status: 500 });
  }
}
