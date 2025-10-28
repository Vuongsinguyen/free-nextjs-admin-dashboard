"use client";

interface Country {
  id: number;
  code: string;
  name: string;
  nameEn: string;
  phoneCode: string;
  provinceCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

interface SortConfig {
  key: keyof Country;
  direction: "asc" | "desc";
}

interface CountryTableProps {
  countries: Country[];
  sortConfig: SortConfig;
  onSort: (key: keyof Country) => void;
  onEdit: (country: Country) => void;
  onDelete: (countryId: number) => void;
}

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  inactive: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

export default function CountryTable({
  countries,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
}: CountryTableProps) {
  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortConfig.direction === "asc" ? (
      <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (countries.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🌍</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Countries Found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your filters or add a new country.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("id")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  ID
                  {getSortIcon("id")}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("code")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  Code
                  {getSortIcon("code")}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("name")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  Country Name
                  {getSortIcon("name")}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("nameEn")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  English Name
                  {getSortIcon("nameEn")}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("phoneCode")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  Phone Code
                  {getSortIcon("phoneCode")}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("provinceCount")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  Provinces
                  {getSortIcon("provinceCount")}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("status")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  Status
                  {getSortIcon("status")}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("createdAt")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  Created At
                  {getSortIcon("createdAt")}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {countries.map((country) => (
              <tr key={country.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{country.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-brand-700 dark:text-brand-400">
                          {country.code}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {country.code}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {country.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {country.nameEn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {country.phoneCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    {country.provinceCount} provinces
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[country.status]}`}>
                    {country.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {formatDate(country.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(country)}
                      className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(country.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}
