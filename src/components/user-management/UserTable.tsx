"use client";

import { UserTableProps } from "@/types/user-management";
import { useLocale } from "@/context/LocaleContext";

const roleColors = {
  "Admin": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  "Building Owner": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "Home Owner": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "Tenant": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  "Guest": "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  "Others": "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
};

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  inactive: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

function getFlagEmoji(nationality?: string) {
  if (!nationality) return '';
  const map: Record<string, string> = {
    vietnam: '🇻🇳',
    vietnamese: '🇻🇳',
    japan: '🇯🇵',
    japanese: '🇯🇵',
    usa: '🇺🇸',
    us: '🇺🇸',
    american: '🇺🇸',
    america: '🇺🇸',
    korea: '🇰🇷',
    korean: '🇰🇷',
    china: '🇨🇳',
    chinese: '🇨🇳',
    france: '🇫🇷',
    french: '🇫🇷',
    germany: '🇩🇪',
    german: '🇩🇪',
    thailand: '🇹🇭',
    thai: '🇹🇭',
    singapore: '🇸🇬',
    singaporean: '🇸🇬',
  britain: '🇬🇧',
  british: '🇬🇧',
  uk: '🇬🇧',
  england: '🇬🇧',
  english: '🇬🇧',
  australia: '🇦🇺',
  australian: '🇦🇺',
    // Add more as needed
  };
  const key = nationality.trim().toLowerCase();
  return map[key] || '';
}

export default function UserTable({
  users,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  currentUser,
  showActions = true,
  onView,
  viewOnly = false,
}: UserTableProps) {
  const { t } = useLocale();
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('userManagement.noUsersFound')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {t('userManagement.tryDifferentFilters')}
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
                  onClick={() => onSort("name")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  {t('userManagement.name')}
                  {getSortIcon("name")}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Room Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contract Type
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("email")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  {t('userManagement.email')}
                  {getSortIcon("email")}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nationality
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("role")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  {t('userManagement.role')}
                  {getSortIcon("role")}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("status")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  {t('userManagement.status')}
                  {getSortIcon("status")}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("createdAt")}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-100"
                >
                  {t('userManagement.createdAt')}
                  {getSortIcon("createdAt")}
                </button>
              </th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('userManagement.actions')}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-brand-700 dark:text-brand-400">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {user.propertyName || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {user.roomNumber || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {user.gender || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {user.contractType || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {user.phoneNumber || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {user.nationality ? (
                    <span className="flex items-center gap-2">
                      <span>{getFlagEmoji(user.nationality)}</span>
                      <span>{user.nationality}</span>
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.role as keyof typeof roleColors] || roleColors.Others}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[user.status]}`}>
                    {user.status === "active" ? t('userManagement.active') : t('userManagement.inactive')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {formatDate(user.createdAt)}
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {viewOnly ? (
                        <button
                          onClick={() => onView?.(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onEdit(user)}
                            className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {currentUser && user.id !== currentUser.id && (
                            <button
                              onClick={() => onDelete(user.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}