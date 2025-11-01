/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase admin client not configured' })
  }

  try {
    const { email, password, name, role, propertyName, roomNumber, fullName } = req.body

    if (!email || !password || !name || !role) {
      return res.status(400).json({
        error: 'Missing required fields: email, password, name, role'
      })
    }

    // Validate role exists
    const { data: roleData, error: roleError } = await (supabaseAdmin as any)
      .from('roles')
      .select('id, name')
      .eq('name', role)
      .single()

    if (roleError || !roleData) {
      return res.status(400).json({
        error: `Role '${role}' does not exist. Available roles: admin, user, resident`
      })
    }

    // Create auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return res.status(500).json({ error: authError.message })
    }

    // Create user profile in public.users table
    const userData = {
      id: authUser.user.id,
      email,
      name,
      role,
      role_id: roleData.id,
      permissions: role === 'admin'
        ? ['user_management', 'service_fee_invoice', 'events_announcements', 'vouchers_promotions', 'facilities', 'full_access']
        : role === 'resident'
        ? ['service_fee_invoice', 'events_announcements', 'facilities']
        : ['events_announcements'], // user permissions
      status: 'active',
      property_name: propertyName || null,
      room_number: roomNumber || null,
      full_name: fullName || name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: userProfile, error: userError } = await (supabaseAdmin as any)
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (userError) {
      console.error('Error creating user profile:', userError)
      // Try to delete the auth user if profile creation failed
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
      return res.status(500).json({ error: userError.message })
    }

    // Return success response
    res.status(201).json({
      message: 'User account created successfully',
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        status: userProfile.status,
        property_name: userProfile.property_name,
        room_number: userProfile.room_number,
        full_name: userProfile.full_name,
        created_at: userProfile.created_at
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}