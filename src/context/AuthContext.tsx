'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface AuthUser {
  id: string;
  role: 'admin' | 'user';
  full_name: string;
  email: string;
  avatar_url?: string;
  provider?: 'google' | 'email_otp' | 'admin' | string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isUser: boolean;
  isLoading: boolean;
  isSupabaseActive: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; error?: string; demoOtp?: string; expiresAt?: number }>;
  verifyEmailOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync current user from server session / Supabase Auth
  const refreshUser = useCallback(async () => {
    try {
      // 1. Check Supabase Auth session first if configured
      if (supabase && isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('full_name, email, role, profile_photo_url')
            .eq('id', session.user.id)
            .maybeSingle();

          setUser({
            id: session.user.id,
            role: (prof?.role as any) || 'user',
            full_name: prof?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'HICET Student',
            email: session.user.email || '',
            avatar_url: prof?.profile_photo_url || session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            provider: session.user.app_metadata?.provider || 'supabase',
          });
          setIsLoading(false);
          return;
        }
      }

      // 2. Check Next.js server cookie session (for Administrator & local OTP sessions)
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

    // Listen to Supabase Auth state changes in real time
    const client = supabase;
    if (client && isSupabaseConfigured) {
      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: prof } = await client
            .from('profiles')
            .select('full_name, email, role, profile_photo_url')
            .eq('id', session.user.id)
            .maybeSingle();

          setUser({
            id: session.user.id,
            role: (prof?.role as any) || 'user',
            full_name: prof?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'HICET Student',
            email: session.user.email || '',
            avatar_url: prof?.profile_photo_url || session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            provider: session.user.app_metadata?.provider || 'supabase',
          });
        } else if (event === 'SIGNED_OUT') {
          // If Supabase signed out and not admin, clear user
          setUser((prev) => (prev?.role === 'admin' ? prev : null));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [refreshUser]);

  // Google OAuth Login
  const loginWithGoogle = async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });
    } else {
      // Fallback to local Google endpoint
      if (typeof window !== 'undefined') {
        window.location.href = '/api/auth/google';
      }
    }
  };

  // Admin Credentials Authentication
  const loginAdmin = async (password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }
      setUser(data.user);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      return { success: false, error: message };
    }
  };

  // Passwordless Email OTP Send
  const sendEmailOtp = async (email: string) => {
    try {
      if (supabase && isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim().toLowerCase(),
          options: {
            shouldCreateUser: true,
          },
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      }

      // Local OTP handler
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to send verification code' };
      }
      return {
        success: true,
        demoOtp: data.demoOtp,
        expiresAt: data.expiresAt,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      return { success: false, error: message };
    }
  };

  // Passwordless Email OTP Verify
  const verifyEmailOtp = async (email: string, otp: string) => {
    try {
      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token: otp.trim(),
          type: 'email',
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          setUser({
            id: data.user.id,
            role: 'user',
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            email: data.user.email || email,
            provider: 'email_otp',
          });
          return { success: true };
        }
      }

      // Local OTP verification
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Verification failed' };
      }
      setUser(data.user);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      return { success: false, error: message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (supabase && isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: !!user && user.role === 'admin',
        isUser: !!user && user.role === 'user',
        isLoading,
        isSupabaseActive: isSupabaseConfigured,
        login: loginAdmin,
        loginAdmin,
        loginWithGoogle,
        sendEmailOtp,
        verifyEmailOtp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
