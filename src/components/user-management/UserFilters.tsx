"use client";

import { UserFiltersProps } from "@/types/user-management";
import { useLocale } from "@/context/LocaleContext";

export default function UserFilters({ filters, onFiltersChange, users, propertyOptions = [], provinceOptions = [] }: UserFiltersProps) {
  const { t } = useLocale();
  // Only get unique statuses from users
  const uniqueStatuses = Array.from(new Set(users.map(user => user.status)));

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };


  const hasActiveFilters = filters.search || filters.status || filters.property || filters.province;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Filter - first column */}
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
        {/* Property Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property
          </label>
          <select
            value={filters.property}
            onChange={(e) => handleFilterChange("property", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All</option>
            {propertyOptions.map((property) => (
              <option key={property} value={property}>{property}</option>
            ))}
          </select>
        </div>
        {/* Province Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Province
          </label>
          <select
            value={filters.province}
            onChange={(e) => handleFilterChange("province", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All</option>
            {provinceOptions.map((province) => (
              <option key={province} value={province}>{province}</option>
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
            {filters.property && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                Property: {filters.property}
                <button
                  onClick={() => handleFilterChange("property", "")}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none focus:bg-purple-200 focus:text-purple-500"
                >
                  <svg className="w-2 h-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                    <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6L1 7" />
                  </svg>
                </button>
              </span>
            )}
            {filters.province && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                Province: {filters.province}
                <button
                  onClick={() => handleFilterChange("province", "")}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-orange-400 hover:bg-orange-200 hover:text-orange-500 focus:outline-none focus:bg-orange-200 focus:text-orange-500"
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