'use client';

import { createContext, useMemo, type ReactNode } from 'react';
import usePersistentState from '@/hooks/usePersistentState';
import * as authService from '../services/authService';
import type { Customer, LoginInput, RegisterInput } from '../types/authTypes';

export interface AuthContextValue {
  customer: Customer | null;
  ready: boolean; // false until the saved session has loaded in the browser
  login: (input: LoginInput) => Promise<Customer>;
  register: (input: RegisterInput) => Promise<Customer>;
  logout: () => Promise<void>;
  updateCustomer: (customer: Customer) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer, ready] = usePersistentState<Customer | null>('kl.session', null);

  const value = useMemo<AuthContextValue>(
    () => ({
      customer,
      ready,
      login: async (input) => {
        const c = await authService.login(input);
        setCustomer(c);
        return c;
      },
      register: async (input) => {
        const c = await authService.register(input);
        setCustomer(c);
        return c;
      },
      logout: async () => {
        await authService.logout();
        setCustomer(null);
      },
      updateCustomer: (c) => setCustomer(c),
    }),
    [customer, ready, setCustomer],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
