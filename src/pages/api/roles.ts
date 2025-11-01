/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase admin client not configured' })
  }

  try {
    if (req.method === 'GET') {
      // List roles with their permissions
      const { data: roles, error: rolesError } = await (supabaseAdmin as any)
        .from('roles')
        .select('*')
        .order('id', { ascending: true })

      if (rolesError) return res.status(500).json({ error: rolesError.message })

      // Fetch role_permissions mapping
      const { data: rp, error: rpError } = await (supabaseAdmin as any)
        .from('role_permissions')
        .select('role_id, permission_id')

      if (rpError) return res.status(500).json({ error: rpError.message })

      const { data: perms, error: permsError } = await (supabaseAdmin as any)
        .from('permissions')
        .select('*')

      if (permsError) return res.status(500).json({ error: permsError.message })

      const permsById = new Map(perms.map((p: any) => [p.id, p]))
      const permsByRole: Record<number, any[]> = {}
      for (const row of rp) {
        permsByRole[row.role_id] = permsByRole[row.role_id] || []
        const p = permsById.get(row.permission_id)
        if (p) permsByRole[row.role_id].push(p)
      }

      const result = roles.map((r: any) => ({ ...r, permissions: permsByRole[r.id] || [] }))
      return res.status(200).json({ roles: result })
    }

    if (req.method === 'POST') {
      const { name, description, permissions } = req.body as { name?: string; description?: string; permissions?: string[] }
      if (!name) return res.status(400).json({ error: 'Missing role name' })

      // Upsert role
      const { data: roleRows, error: roleError } = await (supabaseAdmin as any)
        .from('roles')
        .insert({ name, description: description ?? null })
        .select()

      if (roleError) return res.status(500).json({ error: roleError.message })
      const role = roleRows[0]

      // If permissions provided, attach them
      if (Array.isArray(permissions) && permissions.length) {
        const { data: permRows, error: findPermErr } = await (supabaseAdmin as any)
          .from('permissions')
          .select('id, name')
          .in('name', permissions)

        if (findPermErr) return res.status(500).json({ error: findPermErr.message })

        const rolePerms = permRows.map((p: any) => ({ role_id: role.id, permission_id: p.id }))
        if (rolePerms.length) {
          const { error: addPermErr } = await (supabaseAdmin as any)
            .from('role_permissions')
            .insert(rolePerms)
          if (addPermErr) return res.status(500).json({ error: addPermErr.message })
        }
      }

      return res.status(201).json({ role })
    }

    if (req.method === 'DELETE') {
      const { id, name } = req.query as { id?: string; name?: string }
      if (!id && !name) return res.status(400).json({ error: 'Provide id or name' })

      // Find role id
      let roleId: number | null = null
      if (id) {
        roleId = Number(id)
      } else if (name) {
        const { data: roleRow, error } = await (supabaseAdmin as any)
          .from('roles')
          .select('id')
          .eq('name', name)
          .single()
        if (error || !roleRow) return res.status(404).json({ error: 'Role not found' })
        roleId = roleRow.id
      }

      // Remove mappings first
      const { error: delMapErr } = await (supabaseAdmin as any)
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId)
      if (delMapErr) return res.status(500).json({ error: delMapErr.message })

      const { error: delRoleErr } = await (supabaseAdmin as any)
        .from('roles')
        .delete()
        .eq('id', roleId)
      if (delRoleErr) return res.status(500).json({ error: delRoleErr.message })

      return res.status(200).json({ message: 'Role deleted' })
    }

    res.setHeader('Allow', 'GET,POST,DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e: any) {
    console.error('Roles API error:', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
