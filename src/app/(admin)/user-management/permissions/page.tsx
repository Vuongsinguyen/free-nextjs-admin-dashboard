"use client";

import { useState } from "react";
// import { useLocale } from "@/context/LocaleContext";

interface Permission {
  id: number;
  name: string;
  status: "active" | "inactive";
  permissionGroups: PermissionGroup[];
}

interface PermissionGroup {
  id: string;
  name: string;
  permissions: PermissionItem[];
}

interface PermissionItem {
  id: string;
  name: string;
  checked: boolean;
}

const permissionGroupsData: PermissionGroup[] = [
  {
    id: "user-management",
    name: "User Management",
    permissions: [
      { id: "user-view", name: "View Users", checked: false },
      { id: "user-create", name: "Create Users", checked: false },
      { id: "user-edit", name: "Edit Users", checked: false },
      { id: "user-delete", name: "Delete Users", checked: false },
    ],
  },
  {
    id: "role-management",
    name: "Role Management",
    permissions: [
      { id: "role-view", name: "View Roles", checked: false },
      { id: "role-create", name: "Create Roles", checked: false },
      { id: "role-edit", name: "Edit Roles", checked: false },
      { id: "role-delete", name: "Delete Roles", checked: false },
    ],
  },
  {
    id: "content-management",
    name: "Content Management",
    permissions: [
      { id: "content-view", name: "View Content", checked: false },
      { id: "content-create", name: "Create Content", checked: false },
      { id: "content-edit", name: "Edit Content", checked: false },
      { id: "content-delete", name: "Delete Content", checked: false },
      { id: "content-publish", name: "Publish Content", checked: false },
    ],
  },
  {
    id: "system-settings",
    name: "System Settings",
    permissions: [
      { id: "settings-view", name: "View Settings", checked: false },
      { id: "settings-edit", name: "Edit Settings", checked: false },
      { id: "settings-backup", name: "Backup System", checked: false },
      { id: "settings-restore", name: "Restore System", checked: false },
    ],
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    permissions: [
      { id: "reports-view", name: "View Reports", checked: false },
      { id: "reports-export", name: "Export Reports", checked: false },
      { id: "reports-create", name: "Create Custom Reports", checked: false },
    ],
  },
];

const mockPermissions: Permission[] = [
  {
    id: 1,
    name: "admin",
    status: "active",
    permissionGroups: JSON.parse(JSON.stringify(permissionGroupsData)).map((group: PermissionGroup) => ({
      ...group,
      permissions: group.permissions.map(p => ({ ...p, checked: true })),
    })),
  },
  {
    id: 2,
    name: "Manager",
    status: "active",
    permissionGroups: JSON.parse(JSON.stringify(permissionGroupsData)),
  },
  {
    id: 3,
    name: "Guest",
    status: "active",
    permissionGroups: JSON.parse(JSON.stringify(permissionGroupsData)),
  },
  {
    id: 4,
    name: "building-owner",
    status: "active",
    permissionGroups: JSON.parse(JSON.stringify(permissionGroupsData)),
  },
  {
    id: 5,
    name: "home-owner",
    status: "active",
    permissionGroups: JSON.parse(JSON.stringify(permissionGroupsData)),
  },
  {
    id: 6,
    name: "tenant",
    status: "active",
    permissionGroups: JSON.parse(JSON.stringify(permissionGroupsData)),
  },
  {
    id: 7,
    name: "others",
    status: "active",
    permissionGroups: JSON.parse(JSON.stringify(permissionGroupsData)),
  },
];

export default function RolePermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [showModal, setShowModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const handleAddNew = () => {
    setEditingPermission({
      id: 0,
      name: "",
      status: "active",
      permissionGroups: JSON.parse(JSON.stringify(permissionGroupsData)),
    });
    setShowModal(true);
    setExpandedGroups(new Set(permissionGroupsData.map(g => g.id)));
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(JSON.parse(JSON.stringify(permission)));
    setShowModal(true);
    setExpandedGroups(new Set(permission.permissionGroups.map(g => g.id)));
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this role permission?")) {
      setPermissions(permissions.filter(p => p.id !== id));
    }
  };

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handlePermissionChange = (groupId: string, permissionId: string) => {
    if (!editingPermission) return;

    const updatedGroups = editingPermission.permissionGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          permissions: group.permissions.map(p =>
            p.id === permissionId ? { ...p, checked: !p.checked } : p
          ),
        };
      }
      return group;
    });

    setEditingPermission({
      ...editingPermission,
      permissionGroups: updatedGroups,
    });
  };

  const handleGroupSelectAll = (groupId: string, checked: boolean) => {
    if (!editingPermission) return;

    const updatedGroups = editingPermission.permissionGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          permissions: group.permissions.map(p => ({ ...p, checked })),
        };
      }
      return group;
    });

    setEditingPermission({
      ...editingPermission,
      permissionGroups: updatedGroups,
    });
  };

  const handleSave = () => {
    if (!editingPermission || !editingPermission.name.trim()) {
      alert("Please enter a name");
      return;
    }

    if (editingPermission.id === 0) {
      // Add new
      const newPermission = {
        ...editingPermission,
        id: Math.max(...permissions.map(p => p.id), 0) + 1,
      };
      setPermissions([...permissions, newPermission]);
    } else {
      // Update existing
      setPermissions(permissions.map(p =>
        p.id === editingPermission.id ? editingPermission : p
      ));
    }

    setShowModal(false);
    setEditingPermission(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Role Permissions
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage role-based permissions and access control
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Role Permissions
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  NAME
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {permissions.map((permission) => (
                <tr
                  key={permission.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{permission.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {permission.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        permission.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400"
                      }`}
                    >
                      {permission.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(permission)}
                        className="p-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(permission.id)}
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

      {/* Modal */}
      {showModal && editingPermission && (
        <div className="fixed inset-0 bg-blackO flex items-center justify-center p-4 z-999999">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingPermission.id === 0 ? "Add Role Permissions" : "Edit Role Permissions"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingPermission.name}
                    onChange={(e) => setEditingPermission({ ...editingPermission, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter role name"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editingPermission.status}
                    onChange={(e) => setEditingPermission({ ...editingPermission, status: e.target.value as "active" | "inactive" })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Permissions
                  </label>
                  <div className="space-y-3">
                    {editingPermission.permissionGroups.map((group) => {
                      const allChecked = group.permissions.every(p => p.checked);
                      const someChecked = group.permissions.some(p => p.checked) && !allChecked;

                      return (
                        <div
                          key={group.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                          {/* Group Header */}
                          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleGroup(group.id)}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                              >
                                <svg
                                  className={`w-5 h-5 transition-transform ${
                                    expandedGroups.has(group.id) ? "rotate-90" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={allChecked}
                                  ref={(el) => {
                                    if (el) el.indeterminate = someChecked;
                                  }}
                                  onChange={(e) => handleGroupSelectAll(group.id, e.target.checked)}
                                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                                />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {group.name}
                                </span>
                              </label>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {group.permissions.filter(p => p.checked).length} / {group.permissions.length} selected
                            </span>
                          </div>

                          {/* Group Permissions */}
                          {expandedGroups.has(group.id) && (
                            <div className="p-4 bg-white dark:bg-gray-800 space-y-2">
                              {group.permissions.map((permission) => (
                                <label
                                  key={permission.id}
                                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                                >
                                  <input
                                    type="checkbox"
                                    checked={permission.checked}
                                    onChange={() => handlePermissionChange(group.id, permission.id)}
                                    className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                                  />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {permission.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                  >
                    {editingPermission.id === 0 ? "Create" : "Update"}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
