import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const sampleAnnouncements = [
      {
        title: 'Water Supply Interruption - November 10th',
        content: 'Water supply will be temporarily interrupted on November 10th from 8:00 AM to 2:00 PM for essential maintenance work. Please store sufficient water in advance. We apologize for any inconvenience caused.',
        category: 'maintenance',
        priority: 'high',
        publish_date: '2025-10-28',
        expiry_date: '2025-11-10',
        author: 'John Smith',
        department: 'Maintenance',
        status: 'active',
        views: 234,
        target_audience: 'all',
        is_pinned: true
      },
      {
        title: 'New Security Measures',
        content: 'Starting November 1st, all residents must use access cards for entry. Physical keys will be phased out by November 15th. Please collect your access card from the management office.',
        category: 'policy',
        priority: 'urgent',
        publish_date: '2025-10-25',
        expiry_date: null,
        author: 'Sarah Johnson',
        department: 'Security',
        status: 'active',
        views: 567,
        target_audience: 'all',
        is_pinned: true
      },
      {
        title: 'Lunar New Year Celebration',
        content: 'Join us for a special Lunar New Year celebration on November 15th at 5:00 PM in the community hall. Traditional performances, dinner, and games for all ages. RSVP required.',
        category: 'event',
        priority: 'medium',
        publish_date: '2025-10-27',
        expiry_date: '2025-11-15',
        author: 'David Lee',
        department: 'Community',
        status: 'active',
        views: 189,
        target_audience: 'residents',
        is_pinned: false
      },
      {
        title: 'Elevator Maintenance Schedule',
        content: 'Elevator A will undergo routine maintenance every Monday from 9:00 AM to 11:00 AM. Please use Elevator B during this time.',
        category: 'maintenance',
        priority: 'medium',
        publish_date: '2025-10-20',
        expiry_date: null,
        author: 'Mike Chen',
        department: 'Maintenance',
        status: 'active',
        views: 445,
        target_audience: 'all',
        is_pinned: false
      },
      {
        title: 'Parking Policy Update',
        content: 'New parking regulations will be implemented starting December 1st. Each unit is allocated 2 parking spaces. Additional spaces available on first-come-first-served basis.',
        category: 'policy',
        priority: 'high',
        publish_date: '2025-10-22',
        expiry_date: '2025-12-01',
        author: 'Lisa Wang',
        department: 'Management',
        status: 'active',
        views: 312,
        target_audience: 'owners',
        is_pinned: true
      },
      {
        title: 'Community Yoga Classes',
        content: 'Free yoga classes every Saturday at 7:00 AM in the garden area. All skill levels welcome. Bring your own mat.',
        category: 'event',
        priority: 'low',
        publish_date: '2025-10-15',
        expiry_date: '2025-12-31',
        author: 'Emma Brown',
        department: 'Community',
        status: 'active',
        views: 156,
        target_audience: 'residents',
        is_pinned: false
      },
      {
        title: 'Fire Safety Drill - November 5th',
        content: 'A fire safety drill will be conducted on November 5th at 10:00 AM. All residents must participate. Assembly point is the main parking lot.',
        category: 'general',
        priority: 'urgent',
        publish_date: '2025-10-30',
        expiry_date: '2025-11-05',
        author: 'Robert Martinez',
        department: 'Security',
        status: 'active',
        views: 678,
        target_audience: 'all',
        is_pinned: true
      },
      {
        title: 'Swimming Pool Closure',
        content: 'The swimming pool will be closed from November 12-14 for deep cleaning and filter replacement. We apologize for the inconvenience.',
        category: 'maintenance',
        priority: 'medium',
        publish_date: '2025-11-01',
        expiry_date: '2025-11-14',
        author: 'John Smith',
        department: 'Maintenance',
        status: 'active',
        views: 89,
        target_audience: 'all',
        is_pinned: false
      },
      {
        title: 'Holiday Waste Collection Schedule',
        content: 'Waste collection schedule will be adjusted during the holiday period. Collection will be on Tuesday and Friday instead of Monday and Thursday.',
        category: 'general',
        priority: 'medium',
        publish_date: '2025-10-18',
        expiry_date: '2025-12-15',
        author: 'Amy Nguyen',
        department: 'Operations',
        status: 'active',
        views: 234,
        target_audience: 'all',
        is_pinned: false
      },
      {
        title: 'Monthly Residents Meeting',
        content: 'The monthly residents meeting will be held on November 20th at 7:00 PM in the community hall. Agenda includes budget review and upcoming projects.',
        category: 'event',
        priority: 'medium',
        publish_date: '2025-11-05',
        expiry_date: '2025-11-20',
        author: 'David Lee',
        department: 'Community',
        status: 'active',
        views: 123,
        target_audience: 'residents',
        is_pinned: false
      }
    ];

    const { data, error } = await supabase
      .from('announcements')
      .insert(sampleAnnouncements)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Successfully seeded announcements',
      count: data?.length || 0,
      data
    });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
