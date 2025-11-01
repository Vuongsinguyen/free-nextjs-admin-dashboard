/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const initialShops = [
  { name: "Coffee House - Thủ Dầu Một", category: "Coffee Shop", province: "Bình Dương", district: "Thủ Dầu Một", address: "123 Yersin, P. Phú Cường", google_map_link: "https://maps.google.com/?q=Coffee+House+Thu+Dau+Mot", status: "active" },
  { name: "Market Box - Quận 1", category: "Supermarket", province: "Hồ Chí Minh", district: "Quận 1", address: "456 Nguyễn Huệ, P. Bến Nghé", google_map_link: "https://maps.google.com/?q=Market+Box+Q1", status: "active" },
  { name: "Maisa Restaurant - Dĩ An", category: "Restaurant", province: "Bình Dương", district: "Dĩ An", address: "789 Đại lộ Bình Dương, P. Dĩ An", google_map_link: "https://maps.google.com/?q=Maisa+Di+An", status: "active" },
  { name: "Vincom Pool - Quận 2", category: "Pool", province: "Hồ Chí Minh", district: "Quận 2", address: "Vincom Mega Mall Thảo Điền", google_map_link: "https://maps.google.com/?q=Vincom+Q2", status: "active" },
  { name: "CGV Cinema - Thủ Dầu Một", category: "Fest", province: "Bình Dương", district: "Thủ Dầu Một", address: "AEON Mall Bình Dương Canary", google_map_link: "https://maps.google.com/?q=CGV+TDM", status: "active" },
  { name: "CONG Coffee - Quận 3", category: "Coffee Shop", province: "Hồ Chí Minh", district: "Quận 3", address: "34 Võ Văn Tần, P.6", google_map_link: "https://maps.google.com/?q=CONG+Coffee+Q3", status: "active" },
  { name: "Becamex Store - Thuận An", category: "Convenience Store", province: "Bình Dương", district: "Thuận An", address: "KCN VSIP I, P. Bình Hòa", google_map_link: "https://maps.google.com/?q=Becamex+Thuan+An", status: "active" },
  { name: "Maisa Restaurant - Hoàn Kiếm", category: "Restaurant", province: "Hà Nội", district: "Hoàn Kiếm", address: "15 Hàng Bài, P. Tràng Tiền", google_map_link: "https://maps.google.com/?q=Maisa+HN", status: "active" },
  { name: "Market Box - Quận 7", category: "Supermarket", province: "Hồ Chí Minh", district: "Quận 7", address: "Crescent Mall, Phú Mỹ Hưng", google_map_link: "https://maps.google.com/?q=Market+Box+Q7", status: "inactive" },
  { name: "Vincom Pool - Dĩ An", category: "Pool", province: "Bình Dương", district: "Dĩ An", address: "Vincom Plaza Dĩ An", google_map_link: "https://maps.google.com/?q=Vincom+Di+An", status: "active" },
  { name: "CGV Cinema - Cầu Giấy", category: "Fest", province: "Hà Nội", district: "Cầu Giấy", address: "Vincom Mega Mall Times City", google_map_link: "https://maps.google.com/?q=CGV+Times+City", status: "active" },
  { name: "Coffee House - Quận 1", category: "Coffee Shop", province: "Hồ Chí Minh", district: "Quận 1", address: "234 Lê Lợi, P. Bến Thành", google_map_link: "https://maps.google.com/?q=Coffee+House+Q1", status: "active" },
  { name: "Becamex Store - Thủ Dầu Một", category: "Convenience Store", province: "Bình Dương", district: "Thủ Dầu Một", address: "567 Đại lộ Bình Dương, P. Phú Hòa", google_map_link: "https://maps.google.com/?q=Becamex+TDM", status: "active" },
  { name: "Maisa Restaurant - Đống Đa", category: "Restaurant", province: "Hà Nội", district: "Đống Đa", address: "88 Láng Hạ, P. Thành Công", google_map_link: "https://maps.google.com/?q=Maisa+DD", status: "inactive" },
  { name: "Market Box - Quận 2", category: "Supermarket", province: "Hồ Chí Minh", district: "Quận 2", address: "The Vista Building, An Phú", google_map_link: "https://maps.google.com/?q=Market+Box+Q2", status: "active" },
  { name: "Vincom Pool - Thuận An", category: "Pool", province: "Bình Dương", district: "Thuận An", address: "Vincom Plaza Thuận An", google_map_link: "https://maps.google.com/?q=Vincom+Thuan+An", status: "inactive" },
  { name: "CGV Cinema - Quận 3", category: "Fest", province: "Hồ Chí Minh", district: "Quận 3", address: "Parkson Lê Thánh Tôn", google_map_link: "https://maps.google.com/?q=CGV+Q3", status: "active" },
  { name: "CONG Coffee - Ba Đình", category: "Coffee Shop", province: "Hà Nội", district: "Ba Đình", address: "45 Nguyễn Thái Học", google_map_link: "https://maps.google.com/?q=CONG+Ba+Dinh", status: "active" },
  { name: "Becamex Store - Dĩ An", category: "Convenience Store", province: "Bình Dương", district: "Dĩ An", address: "890 Quốc lộ 1K, P. Tân Đông Hiệp", google_map_link: "https://maps.google.com/?q=Becamex+Di+An", status: "active" },
  { name: "Maisa Restaurant - Quận 7", category: "Restaurant", province: "Hồ Chí Minh", district: "Quận 7", address: "Lotte Mart Phú Mỹ Hưng", google_map_link: "https://maps.google.com/?q=Maisa+Q7", status: "active" },
];

export async function POST() {
  try {
    console.log('📊 Starting shops seed...');
    console.log(`   Total shops to seed: ${initialShops.length}`);

    const { data, error } = await supabase
      .from('shops')
      .upsert(initialShops as any, { 
        onConflict: 'name',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('❌ Seed error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} shops`);
    
    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      message: `Seeded ${data?.length || 0} shops successfully`
    });
  } catch (error: any) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
