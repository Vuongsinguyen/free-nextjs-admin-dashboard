"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  role: string;
  email: string;
  name: string;
  permissions: string[];
  status: string;
  property_name?: string;
  room_number?: string;
  full_name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  initializeAuth: () => Promise<void>;
  roleSelected: boolean;
  selectRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Changed to false - no initial loading
  const [roleSelected, setRoleSelected] = useState(false);
  const router = useRouter();

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      // Add timeout to the query (reduced to 8 seconds for faster loading)
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 8000)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Database error fetching user profile:', error);
        // If it's a permission error, the user might not have access to their own data
        if (error.code === 'PGRST116' || error.message?.includes('permission')) {
          console.warn('RLS policy blocking user profile access. Using session data only.');
          return null;
        }
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Network/timeout error fetching user profile, using session fallback:', error);
      return null;
    }
  };

  // Initialize auth state (called when role is selected)
  const initializeAuth = async () => {
    if (roleSelected) return; // Already initialized

    setLoading(true);
    try {
      // Get initial session with shorter timeout (10 seconds)
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Session fetch timeout')), 10000)
      );

      const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Error getting session:', error);
        
        // Handle invalid refresh token by clearing session
        if (error.message?.includes('refresh_token_not_found') || error.message?.includes('Invalid Refresh Token')) {
          console.warn('Invalid refresh token detected, clearing session...');
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          setUser(null);
          router.push('/signin');
          setLoading(false);
          return;
        }
        
        setLoading(false);
        return;
      }

      if (session?.user) {
        // Immediately set basic user data from session to speed up loading
        const basicUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email || 'Unknown User',
          role: session.user.user_metadata?.role || 'user',
          permissions: [],
          status: 'active',
        };
        setUser(basicUser);
        setIsAuthenticated(true);

        // Fetch user profile in background with shorter timeout (5 seconds)
        const profilePromise = fetchUserProfile(session.user.id);
        const profileTimeout = new Promise<User | null>((_, reject) =>
          setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
        );

        try {
          const userProfile = await Promise.race([profilePromise, profileTimeout]) as User | null;
          if (userProfile) {
            setUser(userProfile); // Update with full profile data
            console.log('Updated with full user profile');
          }
        } catch (error) {
          console.warn('Failed to fetch user profile, keeping session data:', error);
          // Keep the basic user data that's already set
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      // Always set loading to false after initial session check
      setLoading(false);
    }
  };

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        console.log('Auth state changed:', event, session?.user?.email);

        try {
          // Handle token refresh errors
          if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed successfully');
          }
          
          if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }

          if (session?.user) {
            // Try to fetch user profile, but don't fail authentication if it fails
            const userProfile = await fetchUserProfile(session.user.id);
            if (userProfile) {
              setUser(userProfile);
              console.log('Successfully loaded user profile from database:', userProfile);
            } else {
              // Create basic user from session if profile fetch fails
              const basicUser: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email || 'Unknown User',
                role: session.user.user_metadata?.role || 'user',
                permissions: [],
                status: 'active',
              };
              setUser(basicUser);
              console.log('Using basic user data from session due to profile fetch failure:', {
                userMetadata: session.user.user_metadata,
                basicUser
              });
            }
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }

          setLoading(false);
        } catch (error: any) {
          console.error('Error in auth state change handler:', error);
          
          // Handle refresh token errors
          if (error?.message?.includes('refresh_token_not_found') || error?.message?.includes('Invalid Refresh Token')) {
            console.warn('Invalid refresh token detected, signing out...');
            await supabase.auth.signOut();
            setUser(null);
            setIsAuthenticated(false);
            router.push('/signin');
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.email, 'User metadata:', data.user.user_metadata);
        
        // CRITICAL: Wait for session to be fully synced to cookies
        // This ensures middleware can detect the session on next request
        console.log('Waiting for session sync...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Explicitly refresh session to ensure it's written to storage/cookies
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session refresh error:', sessionError);
        } else if (sessionData.session) {
          console.log('Session confirmed and synced:', sessionData.session.user.email);
        }
        
        // Try to fetch user profile, but allow login even if it fails
        const userProfile = await fetchUserProfile(data.user.id);
        let finalUser: User;
        if (userProfile) {
          finalUser = userProfile;
          setUser(userProfile);
          console.log('Successfully loaded user profile from database after login:', userProfile);
        } else {
          // Create basic user from session if profile fetch fails
          finalUser = {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.name || data.user.email || 'Unknown User',
            role: data.user.user_metadata?.role || 'user',
            permissions: [],
            status: 'active',
          };
          setUser(finalUser);
          console.log('Using basic user data from session after login due to profile fetch failure:', {
            userMetadata: data.user.user_metadata,
            basicUser: finalUser
          });
        }
        setIsAuthenticated(true);
        
        // Additional safety delay to ensure cookies are fully written
        console.log('Final sync wait before returning success...');
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return { success: true, user: finalUser };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userData: Partial<User> // Prefix with _ to indicate intentionally unused
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // TODO: Create user profile in database after schema is set up
        // const { error: profileError } = await supabase
        //   .from('users')
        //   .insert({
        //     email,
        //     name: userData.name || '',
        //     role: userData.role || 'user',
        //     permissions: userData.permissions || [],
        //     status: userData.status || 'active',
        //     property_name: userData.property_name,
        //     room_number: userData.room_number,
        //     full_name: userData.full_name,
        //   });

        // if (profileError) {
        //   console.error('Error creating user profile:', profileError);
        //   // Clean up auth user if profile creation fails
        //   await supabase.auth.admin.deleteUser(data.user.id);
        //   return { success: false, error: 'Failed to create user profile' };
        // }

        return { success: true };
      }

      return { success: false, error: 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectRole = () => {
    setRoleSelected(true);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    signUp,
    initializeAuth,
    roleSelected,
    selectRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};