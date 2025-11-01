"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  status: string;
}

interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon: string | null;
  parent_id: string | null;
  order_index: number;
  children?: MenuItem[];
}

export default function MenuPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [permissions, setPermissions] = useState<Map<string, Set<string>>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (rolesError) throw rolesError;
      setRoles(rolesData || []);

      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .order('order_index');

      if (menuError) throw menuError;
      
      const menuMap = new Map<string, MenuItem>();
      const rootItems: MenuItem[] = [];
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (menuData || []).forEach((item: any) => {
        menuMap.set(item.id, { ...item, children: [] });
      });

      menuMap.forEach(item => {
        if (item.parent_id) {
          const parent = menuMap.get(item.parent_id);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(item);
          }
        } else {
          rootItems.push(item);
        }
      });

      setMenuItems(rootItems);

      const { data: permData, error: permError } = await supabase
        .from('role_menu_items')
        .select('role_id, menu_item_id');

      if (permError) throw permError;

      const permMap = new Map<string, Set<string>>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (permData || []).forEach((perm: any) => {
        if (!permMap.has(perm.role_id)) {
          permMap.set(perm.role_id, new Set());
        }
        permMap.get(perm.role_id)!.add(perm.menu_item_id);
      });

      setPermissions(permMap);
      
      if (rolesData && rolesData.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firstRole = rolesData[0] as any;
        if (firstRole.id) {
          setSelectedRole(firstRole.id);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (menuId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleMenuItem = (roleId: string, menuItemId: string) => {
    const newPermissions = new Map(permissions);
    if (!newPermissions.has(roleId)) {
      newPermissions.set(roleId, new Set());
    }
    
    const rolePerms = newPermissions.get(roleId)!;
    if (rolePerms.has(menuItemId)) {
      rolePerms.delete(menuItemId);
    } else {
      rolePerms.add(menuItemId);
    }
    
    setPermissions(newPermissions);
  };

  const toggleParentAndChildren = (roleId: string, menuItem: MenuItem, checked: boolean) => {
    const newPermissions = new Map(permissions);
    if (!newPermissions.has(roleId)) {
      newPermissions.set(roleId, new Set());
    }
    
    const rolePerms = newPermissions.get(roleId)!;
    
    if (checked) {
      rolePerms.add(menuItem.id);
    } else {
      rolePerms.delete(menuItem.id);
    }
    
    const toggleChildren = (item: MenuItem) => {
      if (item.children) {
        item.children.forEach(child => {
          if (checked) {
            rolePerms.add(child.id);
          } else {
            rolePerms.delete(child.id);
          }
          toggleChildren(child);
        });
      }
    };
    
    toggleChildren(menuItem);
    setPermissions(newPermissions);
  };

  const savePermissions = async () => {
    if (!selectedRole) return;
    
    setSaving(true);
    try {
      const rolePerms = permissions.get(selectedRole) || new Set();
      
      const { error: deleteError } = await supabase
        .from('role_menu_items')
        .delete()
        .eq('role_id', selectedRole);

      if (deleteError) throw deleteError;

      if (rolePerms.size > 0) {
        const inserts = Array.from(rolePerms).map(menuItemId => ({
          role_id: selectedRole,
          menu_item_id: menuItemId
        }));

        const { error: insertError } = await supabase
          .from('role_menu_items')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert(inserts as any);

        if (insertError) throw insertError;
      }

      alert('Permissions saved successfully!');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Error saving permissions. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (!selectedRole) return null;
    
    const rolePerms = permissions.get(selectedRole) || new Set();
    const isChecked = rolePerms.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups.has(item.id);
    
    let childrenChecked = 0;
    let childrenTotal = 0;
    if (hasChildren) {
      const countChildren = (children: MenuItem[]) => {
        children.forEach(child => {
          childrenTotal++;
          if (rolePerms.has(child.id)) childrenChecked++;
          if (child.children) countChildren(child.children);
        });
      };
      countChildren(item.children!);
    }
    
    const allChildrenChecked = hasChildren && childrenChecked === childrenTotal && childrenTotal > 0;
    const someChildrenChecked = hasChildren && childrenChecked > 0 && childrenChecked < childrenTotal;

    return (
      <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <div className={`flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${level > 0 ? 'pl-8' : ''}`}>
          {hasChildren && (
            <button
              onClick={() => toggleGroup(item.id)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {!hasChildren && <div className="w-4" />}
          
          <label className="flex items-center gap-2 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={isChecked || allChildrenChecked}
              ref={(el) => {
                if (el) el.indeterminate = someChildrenChecked || false;
              }}
              onChange={(e) => {
                if (hasChildren) {
                  toggleParentAndChildren(selectedRole, item, e.target.checked);
                } else {
                  toggleMenuItem(selectedRole, item.id);
                }
              }}
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item.title}</span>
            {item.path && <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{item.path}</span>}
            {hasChildren && <span className="text-xs text-gray-500 dark:text-gray-400">{childrenChecked} / {childrenTotal}</span>}
          </label>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="bg-gray-50 dark:bg-gray-800">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu Permissions</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage which menu items each role can access</p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Roles</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Select a role to manage its menu permissions</p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {roles.map((role) => {
                const rolePerms = permissions.get(role.id) || new Set();
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedRole === role.id ? 'bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-600' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{role.display_name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{role.description || role.name}</p>
                        <p className="text-xs text-brand-600 dark:text-brand-400 mt-2">{rolePerms.size} menu items assigned</p>
                      </div>
                      {selectedRole === role.id && (
                        <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedRole ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu Items</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Select which menu items this role can access</p>
                </div>
                <button
                  onClick={savePermissions}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                {menuItems.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">No menu items found</div>
                ) : (
                  menuItems.map(item => renderMenuItem(item))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">Select a role from the left to manage its menu permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
