"use client";
import React from 'react';
import { useLocale } from '@/context/LocaleContext';

// Ví dụ component sử dụng đa ngôn ngữ
const DashboardWelcome: React.FC = () => {
  const { t } = useLocale();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {t('common.welcome')} - {t('dashboard.title')}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="text-blue-600 dark:text-blue-400 font-semibold">
            {t('dashboard.totalUsers')}
          </h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">1,234</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="text-green-600 dark:text-green-400 font-semibold">
            {t('dashboard.totalRevenue')}
          </h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">$45,678</p>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h3 className="text-yellow-600 dark:text-yellow-400 font-semibold">
            {t('dashboard.totalOrders')}
          </h3>
          <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">567</p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h3 className="text-purple-600 dark:text-purple-400 font-semibold">
            {t('dashboard.activeUsers')}
          </h3>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">890</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {t('dashboard.recentActivity')}
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <span className="text-gray-600 dark:text-gray-300">
              {t('notifications.userCreated')}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">2 {t('common.minutes')} ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <span className="text-gray-600 dark:text-gray-300">
              {t('notifications.userUpdated')}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">5 {t('common.minutes')} ago</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {t('common.refresh')}
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          {t('common.export')}
        </button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          {t('dashboard.statistics')}
        </button>
      </div>
    </div>
  );
};

export default DashboardWelcome;