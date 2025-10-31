"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import UserTable from "@/components/user-management/UserTable";
import UserFilters from "@/components/user-management/UserFilters";
import ResidentDetailModal from "@/components/residents/ResidentDetailModal";
import { User, UserFilters as IUserFilters, SortConfig } from "@/types/user-management";

import mockAccounts from "@/data/mockAccounts.json";


export default function ResidentPage() {
  const { user: currentUser } = useAuth();
  const { t } = useLocale();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IUserFilters>({
    search: "",
    status: "",
    property: "",
    province: "",
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
          // New resident-specific fields
          propertyName: account.propertyName,
          roomNumber: account.roomNumber,
          fullName: account.fullName,
          gender: account.gender,
          contractType: account.contractType,
          phoneNumber: account.phoneNumber,
          nationality: account.nationality,
          passportNumber: account.passportNumber,
          passportIssueDate: account.passportIssueDate,
          passportIssuePlace: account.passportIssuePlace,
          cohabitants: account.cohabitants,
          otherInfo: account.otherInfo,
          // province: not in mockAccounts, so leave blank for now
        }));
        setUsers(usersData);
        setIsLoading(false);
      }, 1000);
    };

    loadUsers();
  }, []);

  // Property options from API
  const [propertyOptions, setPropertyOptions] = useState<string[]>([]);
  useEffect(() => {
    fetch('http://localhost:3000/buildings/property')
      .then(res => res.json())
      .then(data => {
        // Expecting array of property objects or names
        if (Array.isArray(data)) {
          // If array of objects with name property
          if (data.length > 0 && typeof data[0] === 'object' && data[0].name) {
            setPropertyOptions(data.map((p: any) => p.name));
          } else {
            setPropertyOptions(data);
          }
        } else if (data && Array.isArray(data.properties)) {
          if (data.properties.length > 0 && typeof data.properties[0] === 'object' && data.properties[0].name) {
            setPropertyOptions(data.properties.map((p: any) => p.name));
          } else {
            setPropertyOptions(data.properties);
          }
        }
      })
      .catch(() => setPropertyOptions([]));
  }, []);

  // Province options from API
  const [provinceOptions, setProvinceOptions] = useState<string[]>([]);
  useEffect(() => {
    fetch('http://localhost:3000/locations/province')
      .then(res => res.json())
      .then(data => {
        // Expecting array of province names
        if (Array.isArray(data)) {
          setProvinceOptions(data);
        } else if (data && Array.isArray(data.provinces)) {
          setProvinceOptions(data.provinces);
        }
      })
      .catch(() => setProvinceOptions([]));
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...users];

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(user => {
        // Search all string fields of the user object
        return Object.entries(user).some(([key, value]) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(search);
          }
          return false;
        });
      });
    }


    // Always filter to only show residents
    result = result.filter(user => user.role === 'resident');

    if (filters.status) {
      result = result.filter(user => user.status === filters.status);
    }

    if (filters.property) {
      result = result.filter(user => user.propertyName === filters.property);
    }

    if (filters.province) {
      // No province field in user, so skip for now (future: add province to user data)
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

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
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
            {t('nav.resident')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {/* Description removed as requested */}
          </p>
        </div>
      </div>

      {/* Filters */}
      <UserFilters
        filters={filters}
        onFiltersChange={setFilters}
        users={users.filter(u => u.role === 'resident')}
        propertyOptions={propertyOptions}
        provinceOptions={provinceOptions}
      />



      {/* User Table */}
      <UserTable
        users={paginatedUsers}
        sortConfig={sortConfig}
        onSort={handleSort}
        onEdit={() => {}} // Empty function since no edit functionality
        onDelete={() => {}} // Empty function since no delete functionality
        currentUser={currentUser}
        showActions={true}
        onView={handleViewUser}
        viewOnly={true}
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

      {/* Resident Detail Modal */}
      {showDetailModal && (
        <ResidentDetailModal
          user={selectedUser}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}