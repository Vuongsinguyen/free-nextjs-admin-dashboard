import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🚀 Starting master seed for building management...');

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const seeds = [
      { name: 'Building Categories', endpoint: '/api/building-categories/seed' },
      { name: 'Properties', endpoint: '/api/properties/seed' },
      { name: 'Zones', endpoint: '/api/zones/seed' },
      { name: 'Buildings', endpoint: '/api/buildings/seed' },
      { name: 'Floors', endpoint: '/api/floors/seed' },
      { name: 'Property Units', endpoint: '/api/property-units/seed' }
    ];

    const results = [];

    for (const seed of seeds) {
      console.log(`📦 Seeding ${seed.name}...`);
      
      try {
        const response = await fetch(`${baseUrl}${seed.endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) {
          results.push({
            name: seed.name,
            success: false,
            error: data.error || 'Unknown error'
          });
          console.error(`❌ Failed to seed ${seed.name}:`, data.error);
          // Continue with next seed even if this one fails
        } else {
          results.push({
            name: seed.name,
            success: true,
            count: data.count
          });
          console.log(`✅ ${seed.name}: ${data.count} records`);
        }
      } catch (error) {
        results.push({
          name: seed.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`❌ Error seeding ${seed.name}:`, error);
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.reduce((sum, r) => sum + (r.count || 0), 0);

    console.log(`\n🎉 Master seed completed: ${successCount}/${seeds.length} successful, ${totalCount} total records`);

    return NextResponse.json({
      success: successCount === seeds.length,
      message: `Seeded ${successCount}/${seeds.length} tables with ${totalCount} total records`,
      results
    });
  } catch (error) {
    console.error('❌ Master seed error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
