"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import UserTable from "@/components/user-management/UserTable";
import UserModal from "@/components/user-management/UserModal";
import UserFilters from "@/components/user-management/UserFilters";
import { User, UserFilters as IUserFilters, SortConfig } from "@/types/user-management";
import mockAccounts from "@/data/mockAccounts.json";

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

  // Load users from mock data
  useEffect(() => {
    const loadUsers = () => {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const usersData: User[] = mockAccounts.accounts.map(account => ({
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
          status: account.status as "active" | "inactive",
          permissions: account.permissions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        setUsers(usersData);
        setIsLoading(false);
      }, 1000);
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

  const handleDeleteUser = (userId: number) => {
    if (confirm(t('userManagement.deleteConfirm'))) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

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
      // Add new user
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "guest",
        status: userData.status || "active",
        permissions: userData.permissions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers(prev => [...prev, newUser]);
    }
    setShowModal(false);
  };

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
            {t('userManagement.description')}
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