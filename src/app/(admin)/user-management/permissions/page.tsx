"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
}

interface Permission {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

interface PermissionGroup {
  category: string;
  permissions: Permission[];
}

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Map<string, Set<string>>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", display_name: "", description: "" });

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

      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permissions')
        .select('*')
        .order('category, name');

      if (permissionsError) throw permissionsError;
      setPermissions(permissionsData || []);

      const { data: rolePermsData, error: rolePermsError } = await supabase
        .from('role_permissions')
        .select('role_id, permission_id');

      if (rolePermsError) throw rolePermsError;

      const permMap = new Map<string, Set<string>>();
      (rolePermsData || []).forEach((rp: any) => {
        if (!permMap.has(rp.role_id)) {
          permMap.set(rp.role_id, new Set());
        }
        permMap.get(rp.role_id)!.add(rp.permission_id);
      });

      setRolePermissions(permMap);

      if (rolesData && rolesData.length > 0) {
        setSelectedRole(rolesData[0].id);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const groupPermissionsByCategory = (): PermissionGroup[] => {
    const groups = new Map<string, Permission[]>();
    
    permissions.forEach(perm => {
      const category = perm.category || 'Other';
      if (!groups.has(category)) {
        groups.set(category, []);
      }
      groups.get(category)!.push(perm);
    });

    return Array.from(groups.entries()).map(([category, perms]) => ({
      category,
      permissions: perms
    }));
  };

  const toggleGroup = (category: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedGroups(newExpanded);
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    const newRolePerms = new Map(rolePermissions);
    if (!newRolePerms.has(roleId)) {
      newRolePerms.set(roleId, new Set());
    }
    
    const rolePerms = newRolePerms.get(roleId)!;
    if (rolePerms.has(permissionId)) {
      rolePerms.delete(permissionId);
    } else {
      rolePerms.add(permissionId);
    }
    
    setRolePermissions(newRolePerms);
  };

  const toggleAllInGroup = (roleId: string, groupPermissions: Permission[], checked: boolean) => {
    const newRolePerms = new Map(rolePermissions);
    if (!newRolePerms.has(roleId)) {
      newRolePerms.set(roleId, new Set());
    }
    
    const rolePerms = newRolePerms.get(roleId)!;
    
    groupPermissions.forEach(perm => {
      if (checked) {
        rolePerms.add(perm.id);
      } else {
        rolePerms.delete(perm.id);
      }
    });
    
    setRolePermissions(newRolePerms);
  };

  const savePermissions = async () => {
    if (!selectedRole) return;
    
    setSaving(true);
    try {
      const rolePerms = rolePermissions.get(selectedRole) || new Set();
      
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', selectedRole);

      if (deleteError) throw deleteError;

      if (rolePerms.size > 0) {
        const inserts = Array.from(rolePerms).map(permissionId => ({
          role_id: selectedRole,
          permission_id: permissionId
        }));

        const { error: insertError } = await supabase
          .from('role_permissions')
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

  const createRole = async () => {
    if (!newRole.name || !newRole.display_name) {
      alert('Please fill in role name and display name');
      return;
    }

    try {
      const { error } = await supabase
        .from('roles')
        .insert([{
          name: newRole.name,
          display_name: newRole.display_name,
          description: newRole.description || null
        }]);

      if (error) throw error;

      setShowRoleModal(false);
      setNewRole({ name: "", display_name: "", description: "" });
      fetchData();
      alert('Role created successfully!');
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Error creating role. Please try again.');
    }
  };

  const renderPermissionGroup = (group: PermissionGroup) => {
    if (!selectedRole) return null;
    
    const rolePerms = rolePermissions.get(selectedRole) || new Set();
    const isExpanded = expandedGroups.has(group.category);
    
    const checkedCount = group.permissions.filter(p => rolePerms.has(p.id)).length;
    const totalCount = group.permissions.length;
    const allChecked = checkedCount === totalCount && totalCount > 0;
    const someChecked = checkedCount > 0 && checkedCount < totalCount;

    return (
      <div key={group.category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => toggleGroup(group.category)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg 
                  className={\`w-5 h-5 transition-transform \${isExpanded ? 'rotate-90' : ''}\`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = someChecked;
                  }}
                  onChange={(e) => toggleAllInGroup(selectedRole, group.permissions, e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{group.category}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {checkedCount} / {totalCount} permissions selected
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {group.permissions.map(permission => (
              <div key={permission.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rolePerms.has(permission.id)}
                    onChange={() => togglePermission(selectedRole, permission.id)}
                    className="mt-0.5 w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{permission.name}</div>
                    {permission.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {permission.description}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Permissions</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage permissions for each role</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowRoleModal(true)}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Role
          </button>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Roles</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Select a role to manage permissions</p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {roles.map((role) => {
                const rolePerms = rolePermissions.get(role.id) || new Set();
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={\`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors \${
                      selectedRole === role.id ? 'bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-600' : ''
                    }\`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{role.display_name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{role.description || role.name}</p>
                        <p className="text-xs text-brand-600 dark:text-brand-400 mt-2">
                          {rolePerms.size} permissions assigned
                        </p>
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
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Permissions</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Select permissions for {roles.find(r => r.id === selectedRole)?.display_name}
                  </p>
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

              <div className="space-y-3">
                {groupPermissionsByCategory().map(group => renderPermissionGroup(group))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">Select a role from the left to manage its permissions</p>
            </div>
          )}
        </div>
      </div>

      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Role</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., admin, manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRole.display_name}
                    onChange={(e) => setNewRole({ ...newRole, display_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Administrator, Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Role description..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={createRole}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700"
                >
                  Create Role
                </button>
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setNewRole({ name: "", display_name: "", description: "" });
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
