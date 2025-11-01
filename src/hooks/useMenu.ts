"use client";
import { useState, useEffect } from 'react';
import { MenuGroup } from '@/types/menu';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const MENU_CACHE_KEY = 'app_menu_cache';
const MENU_CACHE_TIMESTAMP_KEY = 'app_menu_cache_timestamp';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

export const useMenu = () => {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>(() => {
    // Initialize with cached data if available
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(MENU_CACHE_KEY);
        const timestamp = localStorage.getItem(MENU_CACHE_TIMESTAMP_KEY);
        
        if (cached && timestamp) {
          const cacheAge = Date.now() - parseInt(timestamp);
          if (cacheAge < CACHE_DURATION) {
            return JSON.parse(cached);
          }
        }
      } catch (err) {
        console.error('Error reading menu cache:', err);
      }
    }
    return [];
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchMenu = async () => {
      if (!isAuthenticated || !user) {
        setMenuGroups([]);
        setLoading(false);
        // Clear cache when logged out
        if (typeof window !== 'undefined') {
          localStorage.removeItem(MENU_CACHE_KEY);
          localStorage.removeItem(MENU_CACHE_TIMESTAMP_KEY);
        }
        return;
      }

      // Check if we have valid cached data
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(MENU_CACHE_KEY);
          const timestamp = localStorage.getItem(MENU_CACHE_TIMESTAMP_KEY);
          
          if (cached && timestamp) {
            const cacheAge = Date.now() - parseInt(timestamp);
            if (cacheAge < CACHE_DURATION) {
              // Use cached data and set loading to false immediately
              setMenuGroups(JSON.parse(cached));
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error('Error reading menu cache:', err);
        }
      }

      try {
        setLoading(true);
        setError(null);

        // Get the current session to send the access token
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('No active session');
        }

        const response = await fetch('/api/menu', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch menu');
        }

        if (result.success) {
          const menuData = result.data || [];
          setMenuGroups(menuData);
          
          // Cache the menu data
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(menuData));
              localStorage.setItem(MENU_CACHE_TIMESTAMP_KEY, Date.now().toString());
            } catch (err) {
              console.error('Error caching menu:', err);
            }
          }
        } else {
          throw new Error(result.error || 'Failed to fetch menu');
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setMenuGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [isAuthenticated, user]); // Re-fetch when auth state or user changes

  return { menuGroups, loading, error };
};
