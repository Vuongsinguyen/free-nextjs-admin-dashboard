"use client";
import React, { useEffect, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';

const AccountsInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string>('');
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
  const [accounts, setAccounts] = useState<Array<{ id: string; email: string; name: string; role: string; status: string }>>([]);
  const [passwordHint, setPasswordHint] = useState<string>('');

  const { t } = useLocale();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!isExpanded || accounts.length) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/test-accounts');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load test accounts');
        setAccounts(json.accounts || []);
        setPasswordHint(json.passwordHint || '');
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load test accounts');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [isExpanded, accounts.length]);

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
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-400">Test Accounts Information</h4>
        <svg
          className={`w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {loading && <div className="text-xs text-blue-700 dark:text-blue-300">Loading test accounts...</div>}
          {error && <div className="text-xs text-red-600 dark:text-red-400">{error}</div>}
          {!loading && !error && (accounts.length ? accounts.map((account) => (
            <div key={account.id} className="p-3 bg-white/60 dark:bg-gray-800/60 rounded border border-blue-100 dark:border-blue-700">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900 dark:text-blue-300">
                  {t(`roles.${account.role}`)}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded">
                  {account.role}
                </span>
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <div className="flex items-center gap-2">
                  <span>
                      <strong>{t('dev.testAccounts.email')}</strong> {account.email}
                  </span>
                  <button
                    onClick={() => copyToClipboard(account.email, `email-${account.id}`)}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors flex-shrink-0"
                      title={t('dev.testAccounts.copyEmail')}
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
                  <span>
                    <strong>Password:</strong> {passwordHint || 'Passwd!@2025!!!'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(passwordHint || 'Passwd!@2025!!!', `password-${account.id}`)}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded transition-colors flex-shrink-0"
                    title="Copy Password"
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

                <div>
                    <strong>{t('dev.testAccounts.name')}</strong> {account.name}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-xs text-blue-700 dark:text-blue-300">No test accounts found.</div>
          ))}

          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-300">
              {t('dev.testAccounts.note')}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsInfo;