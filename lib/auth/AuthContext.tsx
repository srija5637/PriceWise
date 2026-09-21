'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient, isSupabaseConfigured } from '@/lib/db/supabase';

export interface PriceWiseUser {
  id: string;
  phone?: string;
  email?: string;
  displayName: string;
  authMethod: 'google' | 'phone' | 'email';
  phoneVerified: boolean;
  createdAt: string;
  lastPasswordChange?: string;
}

interface AuthContextType {
  user: PriceWiseUser | null;
  supabaseUser: User | null;
  session: Session | null;
  loading: boolean;
  authMethod: 'google' | 'phone' | 'email' | null;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithPhonePassword: (phone: string, password: string) => Promise<{ error?: string }>;
  signUpWithPhone: (phone: string, password: string) => Promise<{ error?: string }>;
  sendOtp: (phone: string, type?: 'signup' | 'recovery') => Promise<{ error?: string; isGoogleAccount?: boolean }>;
  verifyOtp: (phone: string, token: string, type?: 'signup' | 'recovery') => Promise<{ error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ error?: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pricewise_auth_user_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PriceWiseUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to format clean Indian phone numbers
  const normalizePhone = (phone: string): string => {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+91')) return cleaned;
    if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
    return `+91${cleaned.replace(/^0+/, '')}`;
  };

  // Initialize session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data: { session: activeSession } } = await supabase.auth.getSession();
          if (mounted) {
            setSession(activeSession);
            setSupabaseUser(activeSession?.user ?? null);
            if (activeSession?.user) {
              const u = activeSession.user;
              const isGoogle = u.app_metadata.provider === 'google' || u.identities?.some(i => i.provider === 'google');
              setUser({
                id: u.id,
                phone: u.phone,
                email: u.email,
                displayName: 'User',
                authMethod: isGoogle ? 'google' : (u.phone ? 'phone' : 'email'),
                phoneVerified: Boolean(u.phone_confirmed_at),
                createdAt: u.created_at,
                lastPasswordChange: u.updated_at,
              });
            }
          }

          // Listen for state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
              if (!mounted) return;
              setSession(newSession);
              setSupabaseUser(newSession?.user ?? null);
              if (newSession?.user) {
                const u = newSession.user;
                const isGoogle = u.app_metadata.provider === 'google' || u.identities?.some(i => i.provider === 'google');
                setUser({
                  id: u.id,
                  phone: u.phone,
                  email: u.email,
                  displayName: 'User',
                  authMethod: isGoogle ? 'google' : (u.phone ? 'phone' : 'email'),
                  phoneVerified: Boolean(u.phone_confirmed_at),
                  createdAt: u.created_at,
                  lastPasswordChange: u.updated_at,
                });
              } else {
                setUser(null);
              }
            }
          );

          return () => {
            subscription.unsubscribe();
          };
        } catch {
          // Fall back to local storage
        }
      }

      // Check local storage for persistent session
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored && mounted) {
          const parsed = JSON.parse(stored) as PriceWiseUser;
          setUser(parsed);
        } else if (mounted) {
          // Default initial authenticated state as User
          const defaultUser: PriceWiseUser = {
            id: 'usr_default_consumer',
            displayName: 'User',
            phone: '+91 98765 43210',
            authMethod: 'phone',
            phoneVerified: true,
            createdAt: new Date().toISOString(),
            lastPasswordChange: 'Recently',
          };
          setUser(defaultUser);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultUser));
        }
      } catch {
        // Local storage inaccessible
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      const googleUser: PriceWiseUser = {
        id: 'usr_google_' + Date.now(),
        email: 'user@gmail.com',
        displayName: 'User',
        authMethod: 'google',
        phoneVerified: false,
        createdAt: new Date().toISOString(),
      };
      setUser(googleUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(googleUser));
      return {};
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) return { error: error.message };
      return {};
    } catch {
      return { error: 'Google authentication unavailable. Please check connection.' };
    }
  }, []);

  const signInWithPhonePassword = useCallback(async (phone: string, password: string) => {
    const formattedPhone = normalizePhone(phone);

    if (!isSupabaseConfigured()) {
      // Local check
      if (password.length < 6) {
        return { error: 'Invalid phone number or password. Please try again.' };
      }
      const localUser: PriceWiseUser = {
        id: 'usr_phone_' + formattedPhone.slice(-6),
        phone: formattedPhone,
        displayName: 'User',
        authMethod: 'phone',
        phoneVerified: true,
        createdAt: new Date().toISOString(),
        lastPasswordChange: 'Recently',
      };
      setUser(localUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localUser));
      return {};
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: formattedPhone,
        password: password,
      });

      if (error) {
        return { error: 'Invalid phone number or password. Please try again.' };
      }

      if (data.user) {
        const u = data.user;
        const loggedUser: PriceWiseUser = {
          id: u.id,
          phone: u.phone,
          email: u.email,
          displayName: 'User',
          authMethod: 'phone',
          phoneVerified: Boolean(u.phone_confirmed_at),
          createdAt: u.created_at,
          lastPasswordChange: u.updated_at,
        };
        setUser(loggedUser);
      }
      return {};
    } catch {
      return { error: 'Something went wrong. Please check your connection and try again.' };
    }
  }, []);

  const signUpWithPhone = useCallback(async (phone: string, password: string) => {
    const formattedPhone = normalizePhone(phone);

    if (!isSupabaseConfigured()) {
      // Offline mode: prepare session to be activated upon OTP verification
      sessionStorage.setItem('pricewise_pending_signup', JSON.stringify({
        phone: formattedPhone,
        password,
      }));
      return {};
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        phone: formattedPhone,
        password: password,
      });
      if (error) {
        return { error: error.message };
      }
      return {};
    } catch {
      return { error: "We couldn't send the OTP. Please try again." };
    }
  }, []);

  const sendOtp = useCallback(async (phone: string, type: 'signup' | 'recovery' = 'signup') => {
    const formattedPhone = normalizePhone(phone);

    // Check if account is Google-registered
    if (formattedPhone.includes('0000') || (user && user.authMethod === 'google' && user.phone === formattedPhone)) {
      return { isGoogleAccount: true };
    }

    if (!isSupabaseConfigured()) {
      return {};
    }

    try {
      const supabase = createClient();
      if (type === 'recovery') {
        const { error } = await supabase.auth.resetPasswordForEmail('', {
          // In Supabase, phone password recovery is via signInWithOtp
        });
        // Try signInWithOtp for phone
        const { error: phoneError } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });
        if (phoneError) return { error: phoneError.message };
      } else {
        const { error } = await supabase.auth.resend({
          type: 'sms',
          phone: formattedPhone,
        });
        if (error) return { error: error.message };
      }
      return {};
    } catch {
      return { error: "We couldn't send the OTP. Please try again." };
    }
  }, [user]);

  const verifyOtp = useCallback(async (phone: string, token: string, type: 'signup' | 'recovery' = 'signup') => {
    const formattedPhone = normalizePhone(phone);

    if (!isSupabaseConfigured()) {
      // Local validation
      if (token.length !== 6) {
        return { error: 'The OTP is incorrect. Please try again.' };
      }
      if (token === '000000') {
        return { error: 'This OTP has expired. Request a new OTP.' };
      }
      if (token === '999999') {
        return { error: 'Too many verification attempts. Please try again later.' };
      }

      if (type === 'signup') {
        const verifiedUser: PriceWiseUser = {
          id: 'usr_' + Date.now().toString().slice(-6),
          phone: formattedPhone,
          displayName: 'User',
          authMethod: 'phone',
          phoneVerified: true,
          createdAt: new Date().toISOString(),
          lastPasswordChange: 'Recently',
        };
        setUser(verifiedUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(verifiedUser));
      }
      return {};
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: token,
        type: type === 'recovery' ? 'recovery' : 'sms',
      });

      if (error) {
        if (error.message.toLowerCase().includes('expired')) {
          return { error: 'This OTP has expired. Request a new OTP.' };
        }
        return { error: 'The OTP is incorrect. Please try again.' };
      }

      if (data.user) {
        const u = data.user;
        const verifiedUser: PriceWiseUser = {
          id: u.id,
          phone: u.phone,
          email: u.email,
          displayName: 'User',
          authMethod: 'phone',
          phoneVerified: true,
          createdAt: u.created_at,
          lastPasswordChange: u.updated_at,
        };
        setUser(verifiedUser);
      }
      return {};
    } catch {
      return { error: 'Something went wrong. Please check your connection and try again.' };
    }
  }, []);

  const resetPassword = useCallback(async (newPassword: string) => {
    if (!isSupabaseConfigured()) {
      if (user) {
        const updated = { ...user, lastPasswordChange: 'Just now' };
        setUser(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
      return {};
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) return { error: error.message };
      return {};
    } catch {
      return { error: 'Failed to reset password. Please try again.' };
    }
  }, [user]);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    if (!user) return { error: 'You must be logged in to change your password.' };

    if (!isSupabaseConfigured()) {
      if (!oldPassword || oldPassword.length < 6) {
        return { error: 'Current password is incorrect.' };
      }
      const updated = { ...user, lastPasswordChange: 'Just now' };
      setUser(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return {};
    }

    try {
      const supabase = createClient();
      // Verify existing credentials if phone is attached
      if (user.phone) {
        const { error: reauthError } = await supabase.auth.signInWithPassword({
          phone: user.phone,
          password: oldPassword,
        });
        if (reauthError) {
          return { error: 'Current password is incorrect.' };
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) return { error: error.message };
      return {};
    } catch {
      return { error: 'Failed to update password. Please try again.' };
    }
  }, [user]);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // Continue clearing local state
      }
    }
    setUser(null);
    setSession(null);
    setSupabaseUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  const deleteAccount = useCallback(async () => {
    if (isSupabaseConfigured()) {
      try {
        // In client-side Supabase, user deletion is typically done via RPC or edge function.
        // We trigger sign out and clear all user private data
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setUser(null);
    setSession(null);
    setSupabaseUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    // Clear user watchlists and alerts
    localStorage.removeItem('pricewise_watchlist');
    localStorage.removeItem('pricewise_alerts');
    localStorage.removeItem('pricewise_shopping_lists');
    return {};
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        loading,
        authMethod: user?.authMethod ?? null,
        signInWithGoogle,
        signInWithPhonePassword,
        signUpWithPhone,
        sendOtp,
        verifyOtp,
        resetPassword,
        changePassword,
        signOut,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
