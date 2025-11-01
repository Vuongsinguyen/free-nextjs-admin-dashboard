/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase admin client not configured' })
  }

  try {
    const { data, error } = await (supabaseAdmin as any)
      .from('users')
      .select('id, email, name, role, status')
      .neq('role', 'resident')
      .order('created_at', { ascending: true })
      .limit(20)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    const passwordHint = process.env.DEV_PASSWORD_HINT || process.env.NEXT_PUBLIC_DEV_PASSWORD_HINT || ''

    return res.status(200).json({ accounts: data ?? [], passwordHint })
  } catch (e: any) {
    console.error('test-accounts error:', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
