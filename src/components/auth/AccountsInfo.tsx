import React, { useState } from 'react';
import mockAccounts from '@/data/mockAccounts.json';

const AccountsInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string>('');

  const roleLabels: Record<string, string> = {
    'admin': 'Admin',
    'building-owner': 'Building Owner',
    'home-owner': 'Home Owner', 
    'tenant': 'Tenant',
    'guest': 'Guest',
    'others': 'Others'
  };

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-400">
          Test Accounts Information
        </h4>
        <svg
          className={`w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-3">
          {mockAccounts.accounts.map((account) => (
            <div
              key={account.id}
              className="p-3 bg-white/60 dark:bg-gray-800/60 rounded border border-blue-100 dark:border-blue-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900 dark:text-blue-300">
                  {roleLabels[account.role] || account.role}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded">
                  {account.role}
                </span>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <div className="flex items-center gap-2">
                  <span><strong>Email:</strong> {account.email}</span>
                  <button
                    onClick={() => copyToClipboard(account.email, `email-${account.id}`)}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors flex-shrink-0"
                    title="Copy email"
                  >
                    {copiedField === `email-${account.id}` ? (
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span><strong>Password:</strong> {account.password}</span>
                  <button
                    onClick={() => copyToClipboard(account.password, `password-${account.id}`)}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors flex-shrink-0"
                    title="Copy password"
                  >
                    {copiedField === `password-${account.id}` ? (
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div><strong>Name:</strong> {account.name}</div>
              </div>
            </div>
          ))}
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-300">
            <strong>Note:</strong> These are test accounts for development purposes only.
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsInfo;