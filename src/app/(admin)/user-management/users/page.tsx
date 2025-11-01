"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import { supabase } from "@/lib/supabase";
import UserTable from "@/components/user-management/UserTable";
import UserModal from "@/components/user-management/UserModal";
import UserFilters from "@/components/user-management/UserFilters";
import { User, UserFilters as IUserFilters, SortConfig } from "@/types/user-management";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { t } = useLocale();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<IUserFilters>({
    search: "",
    role: "",
    status: "",
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load users from Supabase
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        // Fetch users from auth.users via RPC or custom table
        // Note: Direct access to auth.users requires admin/service_role
        // For now, we'll use a custom users table or profiles table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map Supabase users to our User type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const usersData: User[] = (data || []).map((user: any) => ({
          id: user.id,
          name: user.name || user.full_name || user.email?.split('@')[0] || 'Unknown',
          email: user.email,
          role: user.role || 'all_users',
          status: (user.status || 'active') as "active" | "inactive",
          permissions: user.permissions || [],
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          // Resident-specific fields
          propertyName: user.property_name,
          roomNumber: user.room_number,
          fullName: user.full_name,
          gender: user.gender,
          contractType: user.contract_type,
          phoneNumber: user.phone_number,
          nationality: user.nationality,
          passportNumber: user.passport_number,
          passportIssueDate: user.passport_issue_date,
          passportIssuePlace: user.passport_issue_place,
          cohabitants: user.cohabitants,
          otherInfo: user.other_info,
        }));

        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...users];

    // Apply filters
    if (filters.search) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.role) {
      result = result.filter(user => user.role === filters.role);
    }

    if (filters.status) {
      result = result.filter(user => user.status === filters.status);
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof User];
      const bValue = b[sortConfig.key as keyof User];

      // Handle undefined/null values
      const aVal = aValue ?? '';
      const bVal = bValue ?? '';

      if (aVal < bVal) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, filters, sortConfig]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSort = (key: keyof User) => {
    setSortConfig((prevConfig: SortConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm(t('userManagement.deleteConfirm'))) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  // Keep local modal behavior for mock users
  const handleSaveUser = (userData: Partial<User>) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev =>
        prev.map(user =>
          user.id === editingUser.id
            ? { ...user, ...userData, updatedAt: new Date().toISOString() }
            : user
        )
      );
    } else {
      // Add new user (local only)
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "guest",
        status: (userData.status as "active" | "inactive") || "active",
        permissions: userData.permissions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers(prev => [...prev, newUser]);
    }
    setShowModal(false);
  };

  // const handleCreateRealUser = () => {
  //   setShowCreateRealUserModal(true);
  // };

  // const handleSaveRealUser = async (userData: {
  //   email: string;
  //   password: string;
  //   name: string;
  //   role: string;
  //   propertyName?: string;
  //   roomNumber?: string;
  //   fullName?: string;
  // }) => {
  //   try {
  //     const response = await fetch('/api/create-user', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(userData),
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       alert('User created successfully!');
  //       // Refresh users list or add to local state
  //       setUsers(prev => [...prev, {
  //         id: result.user.id,
  //         name: result.user.name,
  //         email: result.user.email,
  //         role: result.user.role,
  //         status: result.user.status,
  //         permissions: [],
  //         createdAt: result.user.created_at,
  //         updatedAt: result.user.created_at,
  //         propertyName: result.user.property_name,
  //         roomNumber: result.user.room_number,
  //         fullName: result.user.full_name,
  //       }]);
  //       setShowCreateRealUserModal(false);
  //     } else {
  //       alert(`Error: ${result.error}`);
  //     }
  //   } catch (error) {
  //     console.error('Error creating user:', error);
  //     alert('Failed to create user');
  //   }
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('userManagement.loadingUsers')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('userManagement.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {/* Description removed as requested */}
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + {t('userManagement.addUser')}
        </button>
      </div>      {/* Filters */}
      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
        users={users}
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {users.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('userManagement.totalUsers')}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.status === "active").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('userManagement.activeUsers')}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">
            {users.filter(u => u.status === "inactive").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('userManagement.inactiveUsers')}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">
            {filteredUsers.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('userManagement.filteredResults')}
          </div>
        </div>
      </div>

      {/* User Table */}
      <UserTable
        users={paginatedUsers}
        sortConfig={sortConfig}
        onSort={handleSort}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        currentUser={currentUser}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('userManagement.showing')} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} {t('userManagement.of')} {filteredUsers.length} {t('userManagement.results')}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('userManagement.previous')}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? "bg-brand-500 text-white"
                    : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('userManagement.next')}
            </button>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}