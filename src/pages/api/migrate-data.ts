/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import mockAccounts from '@/data/mockAccounts.json'

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
    // Insert default roles
    const rolesData = [
      { name: 'admin', description: 'Administrator with full access' },
      { name: 'user', description: 'Regular user' },
      { name: 'resident', description: 'Resident user' }
    ]

    const { data: roles, error: rolesError } = await (supabaseAdmin as any)
      .from('roles')
      .insert(rolesData)
      .select()

    if (rolesError) {
      console.error('Error inserting roles:', rolesError)
      return res.status(500).json({ error: rolesError.message })
    }

    // Insert default permissions
    const permissionsData = [
      { name: 'user_management', description: 'Manage users' },
      { name: 'service_fee_invoice', description: 'Manage service fees and invoices' },
      { name: 'events_announcements', description: 'Manage events and announcements' },
      { name: 'vouchers_promotions', description: 'Manage vouchers and promotions' },
      { name: 'facilities', description: 'Manage facilities' },
      { name: 'full_access', description: 'Full system access' }
    ]

    const { data: permissions, error: permissionsError } = await (supabaseAdmin as any)
      .from('permissions')
      .insert(permissionsData)
      .select()

    if (permissionsError) {
      console.error('Error inserting permissions:', permissionsError)
      return res.status(500).json({ error: permissionsError.message })
    }

    // Create role_permissions for admin (all permissions)
    const adminRole = (roles as any[]).find((r: any) => r.name === 'admin')
    const rolePermissionsData = (permissions as any[]).map((p: any) => ({
      role_id: adminRole.id,
      permission_id: p.id
    }))

    const { error: rolePermError } = await (supabaseAdmin as any)
      .from('role_permissions')
      .insert(rolePermissionsData)

    if (rolePermError) {
      console.error('Error inserting role_permissions:', rolePermError)
      return res.status(500).json({ error: rolePermError.message })
    }

    // Migrate users from mock data (limit to 20 for testing)
    const usersToInsert = []
    const accountsToMigrate = mockAccounts.accounts.slice(0, 20) // Take first 20 accounts

    // Create System Admin account first
    try {
      const { data: systemAdminUser, error: systemAdminError } = await supabaseAdmin.auth.admin.createUser({
        email: 'systemadmin@gardencity.com',
        password: 'Meomeo0103453322',
        email_confirm: true,
        user_metadata: {
          name: 'System Administrator',
          role: 'admin'
        }
      })

      if (!systemAdminError && systemAdminUser) {
        const adminRole = (roles as any[]).find((r: any) => r.name === 'admin')
        usersToInsert.push({
          id: systemAdminUser.user.id,
          email: 'systemadmin@gardencity.com',
          name: 'System Administrator',
          role: 'admin',
          role_id: adminRole ? adminRole.id : null,
          permissions: ['user_management', 'service_fee_invoice', 'events_announcements', 'vouchers_promotions', 'facilities', 'full_access'],
          status: 'active',
          property_name: 'System',
          room_number: 'ADMIN',
          full_name: 'System Administrator',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        console.log('System Admin account created successfully')
      }
    } catch (error) {
      console.error('Error creating System Admin account:', error)
    }

    for (const account of accountsToMigrate) {
      try {
        // Create auth user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true, // Auto confirm email
          user_metadata: {
            name: account.name,
            role: account.role
          }
        })

        if (authError) {
          console.error('Error creating auth user for', account.email, authError)
          continue // Skip this user
        }

        // Find role_id
        const userRole = (roles as any[]).find((r: any) => r.name === account.role) || (roles as any[]).find((r: any) => r.name === 'user')
        const roleId = userRole ? userRole.id : null

        // Prepare user data for public.users table
        usersToInsert.push({
          id: authUser.user.id,
          email: account.email,
          name: account.name,
          role: account.role, // Keep for backward compatibility
          role_id: roleId,
          permissions: account.permissions,
          status: account.status,
          property_name: account.propertyName,
          room_number: account.roomNumber,
          full_name: account.fullName,
          created_at: new Date(account.createdAt || Date.now()).toISOString(),
          updated_at: new Date().toISOString()
        })
      } catch (err) {
        console.error('Error processing user', account.email, err)
      }
    }

    // Insert users into public.users table
    if (usersToInsert.length > 0) {
      const { error: usersError } = await (supabaseAdmin as any)
        .from('users')
        .insert(usersToInsert)
        .select()

      if (usersError) {
        console.error('Error inserting users:', usersError)
        return res.status(500).json({ error: usersError.message })
      }
    }

    // Sample facilities data
    const facilitiesData = [
      {
        name: 'Conference Room A',
        type: 'conference',
        location: 'Floor 1',
        capacity: 20,
        description: 'Main conference room with video conferencing equipment'
      },
      {
        name: 'Gym',
        type: 'sports',
        location: 'Basement',
        capacity: 50,
        description: 'Fully equipped gymnasium'
      },
      {
        name: 'Swimming Pool',
        type: 'sports',
        location: 'Outdoor',
        capacity: 30,
        description: 'Olympic size swimming pool'
      }
    ]

    const { data: facilities, error: facilitiesError } = await (supabaseAdmin as any)
      .from('facilities')
      .insert(facilitiesData)
      .select()

    if (facilitiesError) {
      console.error('Error inserting facilities:', facilitiesError)
      return res.status(500).json({ error: facilitiesError.message })
    }

    // Sample events data
    const eventsData = [
      {
        title: 'Community Meeting',
        description: 'Monthly community meeting',
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        location: 'Conference Room A',
        organizer: 'Management'
      },
      {
        title: 'Fitness Class',
        description: 'Yoga session for residents',
        start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        location: 'Gym',
        organizer: 'Fitness Team'
      }
    ]

    const { data: events, error: eventsError } = await (supabaseAdmin as any)
      .from('events')
      .insert(eventsData)
      .select()

    if (eventsError) {
      console.error('Error inserting events:', eventsError)
      return res.status(500).json({ error: eventsError.message })
    }

    // Sample locations data
    const locationsData = [
      {
        name: 'Garden City Main',
        address: '123 Main Street',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        zip_code: '70000',
        country: 'Vietnam',
        latitude: 10.8231,
        longitude: 106.6297,
        status: 'active'
      },
      {
        name: 'District 1 Branch',
        address: '456 Nguyen Hue Street',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        zip_code: '70000',
        country: 'Vietnam',
        latitude: 10.7744,
        longitude: 106.7022,
        status: 'active'
      }
    ]

    const { data: locations, error: locationsError } = await (supabaseAdmin as any)
      .from('locations')
      .insert(locationsData)
      .select()

    if (locationsError) {
      console.error('Error inserting locations:', locationsError)
      return res.status(500).json({ error: locationsError.message })
    }

    // Sample buildings data
    const buildingsData = [
      {
        name: 'Building A',
        location_id: (locations as any[]).find(l => l.name === 'Garden City Main')?.id,
        address: '123 Main Street, Building A',
        floors: 10,
        units: 100,
        status: 'active',
        description: 'Main residential building'
      },
      {
        name: 'Building B',
        location_id: (locations as any[]).find(l => l.name === 'Garden City Main')?.id,
        address: '123 Main Street, Building B',
        floors: 8,
        units: 80,
        status: 'active',
        description: 'Secondary residential building'
      }
    ]

    const { data: buildings, error: buildingsError } = await (supabaseAdmin as any)
      .from('buildings')
      .insert(buildingsData)
      .select()

    if (buildingsError) {
      console.error('Error inserting buildings:', buildingsError)
      return res.status(500).json({ error: buildingsError.message })
    }

    // Sample bus_tickets data
    const busTicketsData = [
      {
        route_name: 'Garden City - District 1',
        from_location_id: (locations as any[]).find(l => l.name === 'Garden City Main')?.id,
        to_location_id: (locations as any[]).find(l => l.name === 'District 1 Branch')?.id,
        departure_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        arrival_time: new Date(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        price: 50000,
        available_seats: 45,
        total_seats: 50,
        status: 'active'
      },
      {
        route_name: 'District 1 - Garden City',
        from_location_id: (locations as any[]).find(l => l.name === 'District 1 Branch')?.id,
        to_location_id: (locations as any[]).find(l => l.name === 'Garden City Main')?.id,
        departure_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        arrival_time: new Date(Date.now() + 4 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        price: 50000,
        available_seats: 48,
        total_seats: 50,
        status: 'active'
      }
    ]

    const { data: busTickets, error: busTicketsError } = await (supabaseAdmin as any)
      .from('bus_tickets')
      .insert(busTicketsData)
      .select()

    if (busTicketsError) {
      console.error('Error inserting bus_tickets:', busTicketsError)
      return res.status(500).json({ error: busTicketsError.message })
    }

    // Sample user_buildings data (assign first few users to buildings)
    const userBuildingsData = usersToInsert.slice(0, 5).map((user: any, index: number) => ({
      user_id: user.id,
      building_id: (buildings as any[])[index % buildings.length].id,
      room_number: `A${101 + index}`,
      status: 'active',
      move_in_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))

    const { data: userBuildings, error: userBuildingsError } = await (supabaseAdmin as any)
      .from('user_buildings')
      .insert(userBuildingsData)
      .select()

    if (userBuildingsError) {
      console.error('Error inserting user_buildings:', userBuildingsError)
      return res.status(500).json({ error: userBuildingsError.message })
    }

    // Sample shops data
    const shopsData = [
      {
        name: 'Garden City Grocery',
        location_id: (locations as any[]).find(l => l.name === 'Garden City Main')?.id,
        category: 'Grocery',
        description: 'Convenient grocery store for residents',
        phone: '+84 123 456 789',
        email: 'grocery@gardencity.com',
        status: 'active'
      },
      {
        name: 'District 1 Pharmacy',
        location_id: (locations as any[]).find(l => l.name === 'District 1 Branch')?.id,
        category: 'Pharmacy',
        description: '24/7 pharmacy services',
        phone: '+84 987 654 321',
        email: 'pharmacy@gardencity.com',
        status: 'active'
      },
      {
        name: 'Garden City Cafe',
        location_id: (locations as any[]).find(l => l.name === 'Garden City Main')?.id,
        category: 'Restaurant',
        description: 'Coffee and light meals',
        phone: '+84 555 123 456',
        email: 'cafe@gardencity.com',
        status: 'active'
      }
    ]

    const { data: shops, error: shopsError } = await (supabaseAdmin as any)
      .from('shops')
      .insert(shopsData)
      .select()

    if (shopsError) {
      console.error('Error inserting shops:', shopsError)
      return res.status(500).json({ error: shopsError.message })
    }

    res.status(200).json({
      message: 'Data migration completed successfully',
      data: {
        roles: roles?.length || 0,
        permissions: permissions?.length || 0,
        users: usersToInsert.length,
        facilities: facilities?.length || 0,
        events: events?.length || 0,
        locations: locations?.length || 0,
        buildings: buildings?.length || 0,
        bus_tickets: busTickets?.length || 0,
        user_buildings: userBuildings?.length || 0,
        shops: shops?.length || 0
      }
    })

  } catch (error) {
    console.error('Migration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}