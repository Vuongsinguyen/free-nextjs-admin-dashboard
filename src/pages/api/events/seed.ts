import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const eventsData = [
      {
        title: 'Monthly Residents Meeting',
        description: 'Discussion about building maintenance and upcoming improvements',
        target_audience: 'all',
        start_date: '2025-11-05',
        end_date: '2025-11-05',
        text_content: 'Discussion about building maintenance and upcoming improvements. Location: Community Hall - Floor 1, Time: 18:00',
        status: 'scheduled',
        created_by: 'Building Management',
        created_at: '2025-10-25 10:00:00+00'
      },
      {
        title: 'Fire Safety Drill',
        description: 'Mandatory fire safety drill and evacuation practice',
        target_audience: 'all',
        start_date: '2025-11-10',
        end_date: '2025-11-10',
        text_content: 'Mandatory fire safety drill and evacuation practice. Location: All Building Areas, Time: 10:00',
        status: 'scheduled',
        created_by: 'Safety Department',
        created_at: '2025-10-26 09:00:00+00'
      },
      {
        title: 'Elevator Maintenance',
        description: 'Scheduled maintenance for elevators A & B',
        target_audience: 'all',
        start_date: '2025-11-12',
        end_date: '2025-11-12',
        text_content: 'Scheduled maintenance for elevators A & B. Time: 08:00',
        status: 'scheduled',
        created_by: 'Maintenance Team',
        created_at: '2025-10-27 08:30:00+00'
      },
      {
        title: 'Lunar New Year Celebration',
        description: 'Community celebration with food and entertainment',
        target_audience: 'all',
        start_date: '2025-11-15',
        end_date: '2025-11-15',
        text_content: 'Community celebration with food and entertainment. Location: Rooftop Garden, Time: 17:00',
        status: 'scheduled',
        created_by: 'Residents Committee',
        created_at: '2025-10-28 11:00:00+00'
      },
      {
        title: 'Swimming Pool Cleaning',
        description: 'Deep cleaning and chemical treatment of swimming pool',
        target_audience: 'all',
        start_date: '2025-10-25',
        end_date: '2025-10-25',
        text_content: 'Deep cleaning and chemical treatment of swimming pool. Time: 06:00',
        status: 'expired',
        created_by: 'Maintenance Team',
        created_at: '2025-10-20 14:00:00+00'
      },
      {
        title: 'Building Security Update',
        description: 'Information session about new security measures',
        target_audience: 'all',
        start_date: '2025-10-28',
        end_date: '2025-10-28',
        text_content: 'Information session about new security measures. Location: Meeting Room B, Time: 19:00',
        status: 'active',
        created_by: 'Security Department',
        created_at: '2025-10-24 16:00:00+00'
      },
      {
        title: 'Yoga Class for Residents',
        description: 'Weekly yoga session for all residents',
        target_audience: 'all',
        start_date: '2025-11-01',
        end_date: '2025-11-01',
        text_content: 'Weekly yoga session for all residents. Location: Gym - Floor 5, Time: 06:30',
        status: 'active',
        created_by: 'Fitness Center',
        created_at: '2025-10-22 12:00:00+00'
      },
      {
        title: 'Garden Renovation Notice',
        description: 'Garden area will be closed for renovation',
        target_audience: 'all',
        start_date: '2025-11-20',
        end_date: '2025-11-25',
        text_content: 'Garden area will be closed for renovation. Duration: 5 days',
        status: 'scheduled',
        created_by: 'Landscaping Team',
        created_at: '2025-10-29 10:30:00+00'
      },
      {
        title: 'Children\'s Art Workshop',
        description: 'Art and craft session for children aged 5-12',
        target_audience: 'all',
        start_date: '2025-11-08',
        end_date: '2025-11-08',
        text_content: 'Art and craft session for children aged 5-12. Location: Activity Room, Time: 14:00',
        status: 'scheduled',
        created_by: 'Community Center',
        created_at: '2025-10-30 13:00:00+00'
      },
      {
        title: 'Water Tank Inspection',
        description: 'Annual water tank cleaning and inspection',
        target_audience: 'all',
        start_date: '2025-10-20',
        end_date: '2025-10-20',
        text_content: 'Annual water tank cleaning and inspection. Water supply may be interrupted. Time: 09:00-15:00',
        status: 'expired',
        created_by: 'Maintenance Team',
        created_at: '2025-10-15 08:00:00+00'
      }
    ];

    const { data, error } = await supabase
      .from('events')
      .insert(eventsData)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ 
      message: 'Events seeded successfully',
      count: data.length,
      data 
    });
  } catch (error) {
    console.error('Error seeding events:', error);
    return res.status(500).json({ error: 'Failed to seed events' });
  }
}
