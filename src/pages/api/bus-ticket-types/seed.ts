import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const ticketTypes = [
      {
        ticket_name: 'Monthly Pass - Express',
        ticket_code: 'MP-EXP-001',
        description: 'Unlimited express bus rides for 30 days',
        price: 500000,
        validity: 30,
        routes: ['District 1 - District 7', 'District 2 - District 9', 'Thu Duc - District 1'],
        bus_type: 'Express',
        max_usage_per_day: 10,
        available_time_slots: ['06:00-09:00', '16:00-19:00'],
        status: 'active',
        discount: 0
      },
      {
        ticket_name: 'Weekly Pass - Standard',
        ticket_code: 'WP-STD-002',
        description: 'Unlimited standard bus rides for 7 days',
        price: 150000,
        validity: 7,
        routes: ['District 3 - Binh Thanh', 'District 5 - Tan Binh', 'District 10 - Go Vap'],
        bus_type: 'Standard',
        max_usage_per_day: 8,
        available_time_slots: ['05:00-22:00'],
        status: 'active',
        discount: 10
      },
      {
        ticket_name: 'VIP Monthly Pass',
        ticket_code: 'MP-VIP-003',
        description: 'Premium VIP bus service with luxury amenities for 30 days',
        price: 1200000,
        validity: 30,
        routes: ['All Routes'],
        bus_type: 'VIP',
        max_usage_per_day: 15,
        available_time_slots: ['24/7'],
        status: 'active',
        discount: 15
      },
      {
        ticket_name: 'Single Trip - Express',
        ticket_code: 'ST-EXP-004',
        description: 'One-way express bus ticket',
        price: 25000,
        validity: 1,
        routes: ['District 1 - District 7', 'District 2 - District 9'],
        bus_type: 'Express',
        max_usage_per_day: 1,
        available_time_slots: ['06:00-20:00'],
        status: 'active',
        discount: 0
      },
      {
        ticket_name: 'Student Pass - Standard',
        ticket_code: 'SP-STD-005',
        description: 'Discounted monthly pass for students',
        price: 200000,
        validity: 30,
        routes: ['All Standard Routes'],
        bus_type: 'Standard',
        max_usage_per_day: 12,
        available_time_slots: ['05:00-23:00'],
        status: 'active',
        discount: 40
      },
      {
        ticket_name: 'Weekend Pass - VIP',
        ticket_code: 'WP-VIP-006',
        description: 'VIP bus service for weekends only',
        price: 300000,
        validity: 2,
        routes: ['All VIP Routes'],
        bus_type: 'VIP',
        max_usage_per_day: 20,
        available_time_slots: ['24/7'],
        status: 'active',
        discount: 5
      },
      {
        ticket_name: 'Daily Pass - Standard',
        ticket_code: 'DP-STD-007',
        description: 'Unlimited standard bus rides for one day',
        price: 50000,
        validity: 1,
        routes: ['All Standard Routes'],
        bus_type: 'Standard',
        max_usage_per_day: 15,
        available_time_slots: ['05:00-23:00'],
        status: 'active',
        discount: 0
      },
      {
        ticket_name: 'Senior Citizen Pass',
        ticket_code: 'SC-STD-008',
        description: 'Discounted monthly pass for senior citizens',
        price: 180000,
        validity: 30,
        routes: ['All Standard Routes'],
        bus_type: 'Standard',
        max_usage_per_day: 10,
        available_time_slots: ['06:00-20:00'],
        status: 'active',
        discount: 50
      }
    ];

    const { data, error } = await supabase
      .from('bus_ticket_types')
      .insert(ticketTypes)
      .select();

    if (error) {
      console.error('Error seeding bus ticket types:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Bus ticket types seeded successfully',
      count: data?.length || 0,
      data 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
