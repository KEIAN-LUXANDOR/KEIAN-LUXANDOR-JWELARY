'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AdminUser } from '@/types/models';
import * as authService from '../services/authService';

export interface AuthContextValue {
  user: AdminUser | null;
  ready: boolean; // false until we know whether someone is signed in
  login: (email: string, password: string) => Promise<AdminUser>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authService
      .currentUser()
      .then(setUser)
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
