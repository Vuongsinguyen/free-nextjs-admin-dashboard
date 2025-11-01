/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

// DEV/ADMIN ONLY: Reset a user's password by email using Supabase service role
// Security: Requires header 'x-admin-ops-token' matching process.env.ADMIN_OPS_TOKEN

type Data = { ok: true } | { error: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase admin client not configured' })
  }

  const tokenHeader = req.headers['x-admin-ops-token'] as string | undefined
  const secret = process.env.ADMIN_OPS_TOKEN

  // Allow localhost calls in non-production without token for developer convenience
  const isDev = process.env.NODE_ENV !== 'production'
  const isLocal = (() => {
    const addr = (req.socket as any)?.remoteAddress || ''
    return addr === '::1' || addr === '127.0.0.1' || addr.endsWith('::ffff:127.0.0.1')
  })()

  const tokenValid = !!secret && tokenHeader === secret
  if (!(isDev && isLocal) && !tokenValid) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { email, newPassword } = req.body as { email?: string; newPassword?: string }
  if (!email) {
    return res.status(400).json({ error: 'email is required' })
  }

  const defaultPwd = process.env.DEFAULT_RESET_PASSWORD || process.env.ADMIN_DEFAULT_PASSWORD
  const finalPassword = newPassword && newPassword.length > 0 ? newPassword : defaultPwd
  if (!finalPassword) {
    return res.status(400).json({ error: 'newPassword is required (or configure DEFAULT_RESET_PASSWORD)' })
  }

  try {
    // Supabase JS v2 does not provide getUserByEmail; list and search (ok for admin/dev use)
    let foundUser: any | null = null
    let page = 1
    const perPage = 200
    while (!foundUser) {
      const { data, error } = await (supabaseAdmin as any).auth.admin.listUsers({ page, perPage })
      if (error) return res.status(500).json({ error: error.message })
      if (!data || !data.users || data.users.length === 0) break
      foundUser = data.users.find((u: any) => (u.email || '').toLowerCase() === email.toLowerCase()) || null
      if (data.users.length < perPage) break
      page += 1
      if (page > 50) break // hard cap to avoid excessive loops
    }

    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' })
    }

  const { error: updateErr } = await (supabaseAdmin as any).auth.admin.updateUserById(foundUser.id, { password: finalPassword })
    if (updateErr) {
      return res.status(500).json({ error: updateErr.message })
    }

    return res.status(200).json({ ok: true })
  } catch (e: any) {
    console.error('reset-password error:', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
