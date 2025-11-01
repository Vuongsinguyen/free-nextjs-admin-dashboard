/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase admin client not configured' })
  }

  try {
    // 1) Update roles table names/descriptions
    // Map old->new
    const renameMap: Record<string, { name: string; description: string }> = {
      admin: { name: 'all_users', description: 'All Users' },
      user: { name: 'digital', description: 'Digital' },
    }

    // Fetch existing roles
    const { data: roles, error: rolesErr } = await (supabaseAdmin as any)
      .from('roles')
      .select('*')
    if (rolesErr) return res.status(500).json({ error: rolesErr.message })

    // Rename existing roles if needed
    for (const r of roles as any[]) {
      const rename = renameMap[r.name]
      if (rename) {
        const { error } = await (supabaseAdmin as any)
          .from('roles')
          .update({ name: rename.name, description: rename.description })
          .eq('id', r.id)
        if (error) return res.status(500).json({ error: `Failed to rename role ${r.name}: ${error.message}` })
      }
    }

    // 2) Ensure new roles exist: manager, commercial
    const desired = [
      { name: 'all_users', description: 'All Users' },
      { name: 'digital', description: 'Digital' },
      { name: 'manager', description: 'Manager' },
      { name: 'commercial', description: 'Commercial' },
      // resident remains for mobile app login, but will be hidden on Web
    ]
    const existingNames = new Set((roles as any[]).map(r => r.name))
    for (const d of desired) {
      if (!existingNames.has(d.name)) {
        const { error } = await (supabaseAdmin as any)
          .from('roles')
          .insert({ name: d.name, description: d.description })
        if (error && !String(error.message || '').includes('duplicate')) {
          return res.status(500).json({ error: `Failed to insert role ${d.name}: ${error.message}` })
        }
      }
    }

    // Re-fetch to get updated ids
    const { data: updatedRoles, error: refreshedErr } = await (supabaseAdmin as any)
      .from('roles')
      .select('*')
    if (refreshedErr) return res.status(500).json({ error: refreshedErr.message })

    const roleByName: Record<string, any> = {}
    for (const r of updatedRoles as any[]) roleByName[r.name] = r

    // 3) Update public.users.role strings from old to new
    const userRoleRenameMap: Record<string, string> = {
      admin: 'all_users',
      user: 'digital',
    }
    for (const [oldName, newName] of Object.entries(userRoleRenameMap)) {
      const { error } = await (supabaseAdmin as any)
        .from('users')
        .update({ role: newName, role_id: roleByName[newName]?.id ?? null })
        .eq('role', oldName)
      if (error) return res.status(500).json({ error: `Failed to update users with role ${oldName}: ${error.message}` })
    }

    // 4) Optional: Update auth user_metadata.role for consistency
    try {
      const { data: list, error: listErr } = await (supabaseAdmin as any).auth.admin.listUsers()
      if (!listErr && list?.users) {
        for (const u of list.users) {
          const metaRole = u.user_metadata?.role
          const mapped = metaRole && userRoleRenameMap[metaRole]
          if (mapped) {
            await (supabaseAdmin as any).auth.admin.updateUserById(u.id, {
              user_metadata: { ...u.user_metadata, role: mapped },
            })
          }
        }
      }
    } catch (e) {
      // Non-fatal
      console.warn('Could not update auth user_metadata roles:', e)
    }

    // 5) Attach default permissions for manager & commercial
    const roleDefaultPerms: Record<string, string[]> = {
      manager: ['events_announcements', 'facilities', 'service_fee_invoice', 'vouchers_promotions'],
      commercial: ['vouchers_promotions', 'events_announcements'],
    }

    // Load permissions and existing mappings
    const { data: permissions, error: permsErr } = await (supabaseAdmin as any)
      .from('permissions')
      .select('id, name')
    if (permsErr) return res.status(500).json({ error: permsErr.message })

    const permsByName = new Map((permissions as any[]).map(p => [p.name, p.id]))

    // For each role, ensure mappings exist
    for (const [roleName, permNames] of Object.entries(roleDefaultPerms)) {
      const role = roleByName[roleName]
      if (!role) continue

      const desiredIds = permNames
        .map(n => permsByName.get(n))
        .filter(Boolean)

      // fetch existing mappings for the role
      const { data: existing, error: existErr } = await (supabaseAdmin as any)
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', role.id)
      if (existErr) return res.status(500).json({ error: existErr.message })

      const existingSet = new Set((existing as any[]).map(rp => rp.permission_id))
      const toInsert = desiredIds
        .filter((pid: any) => !existingSet.has(pid))
        .map((pid: any) => ({ role_id: role.id, permission_id: pid }))

      if (toInsert.length) {
        const { error: insErr } = await (supabaseAdmin as any)
          .from('role_permissions')
          .insert(toInsert)
        if (insErr) return res.status(500).json({ error: insErr.message })
      }
    }

    return res.status(200).json({ message: 'Roles migrated', roles: Object.keys(roleByName) })
  } catch (e: any) {
    console.error('migrate-roles error', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
