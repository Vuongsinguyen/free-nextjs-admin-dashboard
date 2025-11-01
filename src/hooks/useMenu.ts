"use client";
import { useState, useEffect } from 'react';
import { MenuGroup } from '@/types/menu';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export const useMenu = () => {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchMenu = async () => {
      if (!isAuthenticated || !user) {
        setMenuGroups([]);
        setLoading(false);
        return;
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
          setMenuGroups(result.data || []);
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
