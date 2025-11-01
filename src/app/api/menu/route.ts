import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MenuItem, MenuGroup } from '@/types/menu';

export async function GET(request: Request) {
  try {
    // Get the authorization token from headers
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create Supabase client with the token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );
    
    // Get the user from the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    console.log('🔐 Menu API - User from token:', user ? user.email : 'NO USER', 'Error:', authError);
    
    if (authError || !user) {
      console.error('❌ Menu API - Invalid token');
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
    
    // Get user's role from database with fallback to all_users
    let userRole = 'all_users';
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    console.log('👤 Menu API - User data from DB:', userData, 'Error:', userError);

    if (!userError && userData?.role) {
      userRole = userData.role;
    } else {
      // Try user_metadata as fallback
      const metaRole = user.user_metadata?.role;
      if (metaRole && typeof metaRole === 'string' && metaRole.length > 0) {
        userRole = metaRole;
      }
    }
    
    console.log('🎭 Menu API - Final user role:', userRole);
    
    // Get role_id from roles table
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', userRole)
      .maybeSingle();

    console.log('📋 Menu API - Role data from DB:', roleData);
    console.log('📋 Menu API - Role error:', roleError);

    if (roleError || !roleData) {
      console.error('❌ Menu API - Role not found:', userRole, 'Error details:', JSON.stringify(roleError));
      // If role not found in DB, return empty menu
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Get menu items for this role
    const { data: roleMenuItems, error: menuError } = await supabase
      .from('role_menu_items')
      .select(`
        menu_item_id,
        menu_items (
          id,
          name_key,
          icon,
          path,
          parent_id,
          menu_group,
          display_order,
          is_active,
          is_pro,
          is_new,
          created_at,
          updated_at
        )
      `)
      .eq('role_id', roleData.id);

    console.log('📝 Menu API - Raw menu items from DB:', {
      count: roleMenuItems?.length || 0,
      error: menuError
    });

    if (menuError) {
      console.error('❌ Menu API - Error fetching menu items:', menuError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch menu items' },
        { status: 500 }
      );
    }

    // Extract menu items from the join result
    // Supabase foreign key select can return array when there are multiple matches
    // But our schema has unique constraint, so it should be first item
    interface RoleMenuRow {
      menu_item_id: string;
      menu_items: MenuItem[] | MenuItem | null;
    }
    
    const menuItems: MenuItem[] = ((roleMenuItems as unknown as RoleMenuRow[]) || [])
      .flatMap((row) => {
        if (!row.menu_items) return [];
        // Handle both single object and array format
        const items = Array.isArray(row.menu_items) ? row.menu_items : [row.menu_items];
        return items.filter((item) => item && item.is_active);
      });

    // Build hierarchical menu structure
    const menuMap = new Map<string, MenuItem>();
    const rootItems: MenuItem[] = [];

    // First pass: create map of all items
    menuItems.forEach((item: MenuItem) => {
      menuMap.set(item.id, { ...item, subItems: [] });
    });

    // Second pass: build hierarchy
    menuItems.forEach((item: MenuItem) => {
      const menuItem = menuMap.get(item.id);
      if (!menuItem) return;

      if (item.parent_id) {
        const parent = menuMap.get(item.parent_id);
        if (parent) {
          if (!parent.subItems) parent.subItems = [];
          parent.subItems.push(menuItem);
        }
      } else {
        rootItems.push(menuItem);
      }
    });

    // Sort items by display_order
    const sortByOrder = (items: MenuItem[]) => {
      items.sort((a, b) => a.display_order - b.display_order);
      items.forEach(item => {
        if (item.subItems && item.subItems.length > 0) {
          sortByOrder(item.subItems);
        }
      });
    };
    sortByOrder(rootItems);

    // Group by menu_group
    const groupedMenu: MenuGroup[] = [
      {
        group: 'main' as const,
        titleKey: 'QUICK ACCESS',
        items: rootItems.filter(item => item.menu_group === 'main')
      },
      {
        group: 'masterData' as const,
        titleKey: 'MASTER DATA',
        items: rootItems.filter(item => item.menu_group === 'masterData')
      },
      {
        group: 'systemConfig' as const,
        titleKey: 'SYSTEM CONFIGURATION',
        items: rootItems.filter(item => item.menu_group === 'systemConfig')
      }
    ].filter(group => group.items.length > 0); // Only include groups with items

    console.log('📦 Menu API - Returning grouped menu:', {
      groups: groupedMenu.length,
      totalItems: groupedMenu.reduce((sum, g) => sum + g.items.length, 0)
    });

    return NextResponse.json({
      success: true,
      data: groupedMenu
    });

  } catch (error) {
    console.error('Error in menu API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
