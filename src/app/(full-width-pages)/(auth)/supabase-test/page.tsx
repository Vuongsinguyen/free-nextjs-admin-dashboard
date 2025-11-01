"use client";
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic connection
        const { error } = await supabase.from('users').select('count').limit(1)

        if (error) {
          setConnectionStatus('error')
          setErrorMessage(error.message)
        } else {
          setConnectionStatus('success')
        }
      } catch (error) {
        setConnectionStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Supabase Setup Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Testing your Supabase connection
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Connection Status
              </h3>
              <div className="mt-2">
                {connectionStatus === 'loading' && (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Testing connection...</span>
                  </div>
                )}

                {connectionStatus === 'success' && (
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-green-600 dark:text-green-400">✅ Connected successfully!</span>
                  </div>
                )}

                {connectionStatus === 'error' && (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="h-4 w-4 rounded-full bg-red-500"></div>
                      <span className="ml-2 text-red-600 dark:text-red-400">❌ Connection failed</span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                      {errorMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {connectionStatus === 'success' && (
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                    Next Steps:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>Run the SQL schema in Supabase Dashboard</li>
                    <li>Migrate data: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">POST /api/migrate-data</code></li>
                    <li>Update your components to use Supabase</li>
                    <li>Test authentication flow</li>
                  </ol>
                </div>

                <div className="flex space-x-3">
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Open Supabase Dashboard
                  </a>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Back to App
                  </button>
                </div>
              </div>
            )}

            {connectionStatus === 'error' && (
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                  Setup Instructions:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Create a project at <a href="https://supabase.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
                  <li>Copy API keys to <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.env.local</code></li>
                  <li>Run SQL schema from <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">supabase-schema.sql</code></li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}