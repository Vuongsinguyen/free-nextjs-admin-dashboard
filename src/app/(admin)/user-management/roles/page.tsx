"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import { supabase } from "@/lib/supabase";

interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
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

export default function UserRolesPage() {
  const { t } = useLocale();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Role;
    direction: "asc" | "desc";
  }>({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .order("category, name");

      if (error) throw error;
      setPermissions(data || []);
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setPermissions([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("roles")
        .select("*")
        .order("name", { ascending: true });

      if (fetchError) throw fetchError;
      setRoles(data || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setRoles([]);
    }
  };

  const handleSort = (key: keyof Role) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedRoles = [...roles].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleEdit = (role: Role) => {
    console.log("Edit role:", role);
    // TODO: Implement edit functionality
  };

  const handleDelete = (roleId: string) => {
    console.log("Delete role:", roleId);
    // TODO: Implement delete functionality
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

  const togglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  const toggleAllInGroup = (groupPermissions: Permission[], checked: boolean) => {
    const newSelected = new Set(selectedPermissions);
    
    groupPermissions.forEach(perm => {
      if (checked) {
        newSelected.add(perm.id);
      } else {
        newSelected.delete(perm.id);
      }
    });
    
    setSelectedPermissions(newSelected);
  };

  const handleCreateRole = async () => {
    if (!newRole.name) {
      alert("Please enter role name");
      return;
    }

    setCreating(true);
    try {
      // Create the role first
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .insert([{
          name: newRole.name,
          description: newRole.description || null
        }] as never)
        .select()
        .single();

      if (roleError) throw roleError;

      // If permissions are selected, insert them into role_permissions
      if (selectedPermissions.size > 0 && roleData) {
        const permissionInserts = Array.from(selectedPermissions).map(permissionId => ({
          role_id: (roleData as any).id,
          permission_id: permissionId
        }));

        const { error: permError } = await supabase
          .from("role_permissions")
          .insert(permissionInserts as never);

        if (permError) throw permError;
      }

      alert("Role created successfully!");
      setShowCreateModal(false);
      setNewRole({ name: "", description: "" });
      setSelectedPermissions(new Set());
      setExpandedGroups(new Set());
      fetchRoles();
    } catch (error) {
      console.error("Error creating role:", error);
      alert("Failed to create role. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof Role }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortConfig.direction === "asc" ? (
      <svg className="w-4 h-4 ml-1 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("nav.userRoles")}
          </h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Role
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th
                  onClick={() => handleSort("id")}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    ID
                    <SortIcon columnKey="id" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    ROLE NAME
                    <SortIcon columnKey="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("description")}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    DESCRIPTION
                    <SortIcon columnKey="description" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("created_at")}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    CREATED AT
                    <SortIcon columnKey="created_at" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedRoles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {role.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {role.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {role.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {role.created_at ? new Date(role.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-blackO flex items-center justify-center p-4 z-999999">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Role</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewRole({ name: "", description: "" });
                    setSelectedPermissions(new Set());
                    setExpandedGroups(new Set());
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Basic Information</h4>
                  
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
                      Description
                    </label>
                    <textarea
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Role description..."
                    />
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                      Permissions ({selectedPermissions.size} selected)
                    </h4>
                    <button
                      onClick={() => {
                        if (selectedPermissions.size === permissions.length) {
                          setSelectedPermissions(new Set());
                        } else {
                          setSelectedPermissions(new Set(permissions.map(p => p.id)));
                        }
                      }}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {selectedPermissions.size === permissions.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {groupPermissionsByCategory().map(group => {
                      const isExpanded = expandedGroups.has(group.category);
                      const checkedCount = group.permissions.filter(p => selectedPermissions.has(p.id)).length;
                      const totalCount = group.permissions.length;
                      const allChecked = checkedCount === totalCount && totalCount > 0;
                      const someChecked = checkedCount > 0 && checkedCount < totalCount;

                      return (
                        <div key={group.category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 dark:bg-gray-800 p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <button
                                  onClick={() => toggleGroup(group.category)}
                                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                  <svg 
                                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                
                                <label className="flex items-center gap-2 cursor-pointer flex-1">
                                  <input
                                    type="checkbox"
                                    checked={allChecked}
                                    ref={(el) => {
                                      if (el) el.indeterminate = someChecked;
                                    }}
                                    onChange={(e) => toggleAllInGroup(group.permissions, e.target.checked)}
                                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                                  />
                                  <div>
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">{group.category}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                      ({checkedCount}/{totalCount})
                                    </span>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                              {group.permissions.map(permission => (
                                <div key={permission.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                  <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={selectedPermissions.has(permission.id)}
                                      onChange={() => togglePermission(permission.id)}
                                      className="mt-0.5 w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                                    />
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900 dark:text-white">{permission.name}</div>
                                      {permission.description && (
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
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
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                <button
                  onClick={handleCreateRole}
                  disabled={creating}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Role"}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewRole({ name: "", description: "" });
                    setSelectedPermissions(new Set());
                    setExpandedGroups(new Set());
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
