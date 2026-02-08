'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface SiteAuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER' | 'VIP';
  bio: string | null;
  emailVerified: boolean;
  createdAt: string;
}

interface SiteAuthContextValue {
  user: SiteAuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  siteSlug: string;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; name?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) => Promise<{ success: boolean; error?: string }>;
}

const SiteAuthContext = createContext<SiteAuthContextValue>({
  user: null,
  loading: true,
  isAuthenticated: false,
  siteSlug: '',
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
  requestPasswordReset: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  updateProfile: async () => ({ success: false }),
});

// ============================================================================
// PROVIDER
// ============================================================================

interface SiteAuthProviderProps {
  siteSlug: string;
  children: React.ReactNode;
}

export function SiteAuthProvider({ siteSlug, children }: SiteAuthProviderProps) {
  const [user, setUser] = useState<SiteAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = `/api/runtime/sites/${siteSlug}/auth`;

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch(`${baseUrl}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          return { success: true };
        }
        return { success: false, error: data.error || 'Anmeldung fehlgeschlagen.' };
      } catch {
        return { success: false, error: 'Netzwerkfehler.' };
      }
    },
    [baseUrl]
  );

  const register = useCallback(
    async (regData: { email: string; password: string; name?: string }) => {
      try {
        const res = await fetch(`${baseUrl}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(regData),
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          return { success: true };
        }
        return { success: false, error: data.error || 'Registrierung fehlgeschlagen.' };
      } catch {
        return { success: false, error: 'Netzwerkfehler.' };
      }
    },
    [baseUrl]
  );

  const logout = useCallback(async () => {
    try {
      await fetch(`${baseUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    }
    setUser(null);
  }, [baseUrl]);

  const requestPasswordReset = useCallback(
    async (email: string) => {
      try {
        const res = await fetch(`${baseUrl}/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          return { success: true };
        }
        return { success: false, error: data.error || 'Anfrage fehlgeschlagen.' };
      } catch {
        return { success: false, error: 'Netzwerkfehler.' };
      }
    },
    [baseUrl]
  );

  const resetPassword = useCallback(
    async (token: string, password: string) => {
      try {
        const res = await fetch(`${baseUrl}/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password }),
        });
        const data = await res.json();
        if (res.ok) {
          return { success: true, message: data.message };
        }
        return { success: false, error: data.error || 'Zurücksetzen fehlgeschlagen.' };
      } catch {
        return { success: false, error: 'Netzwerkfehler.' };
      }
    },
    [baseUrl]
  );

  const updateProfile = useCallback(
    async (profileData: { name?: string; bio?: string; avatar?: string }) => {
      try {
        const res = await fetch(`${baseUrl}/profile`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData),
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          return { success: true };
        }
        return { success: false, error: data.error || 'Aktualisierung fehlgeschlagen.' };
      } catch {
        return { success: false, error: 'Netzwerkfehler.' };
      }
    },
    [baseUrl]
  );

  return (
    <SiteAuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        siteSlug,
        login,
        register,
        logout,
        refreshUser,
        requestPasswordReset,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </SiteAuthContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useSiteAuth() {
  return useContext(SiteAuthContext);
}
