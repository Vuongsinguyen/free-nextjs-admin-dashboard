"use client";

import { UserFiltersProps } from "@/types/user-management";
import { useLocale } from "@/context/LocaleContext";

export default function UserFilters({ filters, onFiltersChange, users }: UserFiltersProps) {
  const { t } = useLocale();
  
  // Get unique roles and statuses from users
  const uniqueRoles = Array.from(new Set(users.map(user => user.role)));
  const uniqueStatuses = Array.from(new Set(users.map(user => user.status)));

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      role: "",
      status: "",
    });
  };

  const hasActiveFilters = filters.search || filters.role || filters.status;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('userManagement.filters')}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            {t('userManagement.clearAllFilters')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('userManagement.search')}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={t('userManagement.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('userManagement.role')}
          </label>
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t('userManagement.allRoles')}</option>
            {uniqueRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('userManagement.status')}
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t('userManagement.allStatuses')}</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "active" ? t('userManagement.active') : t('userManagement.inactive')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">{t('userManagement.activeFilters')}</span>
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900/20 dark:text-brand-400">
                {t('userManagement.search')}: &quot;{filters.search}&quot;
                <button
                  onClick={() => handleFilterChange("search", "")}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-brand-400 hover:bg-brand-200 hover:text-brand-500 focus:outline-none focus:bg-brand-200 focus:text-brand-500"
                >
                  <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}
            {filters.role && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                {t('userManagement.role')}: {filters.role}
                <button
                  onClick={() => handleFilterChange("role", "")}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none focus:bg-green-200 focus:text-green-500"
                >
                  <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                {t('userManagement.status')}: {filters.status === "active" ? t('userManagement.active') : t('userManagement.inactive')}
                <button
                  onClick={() => handleFilterChange("status", "")}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-200 focus:text-blue-500"
                >
                  <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}