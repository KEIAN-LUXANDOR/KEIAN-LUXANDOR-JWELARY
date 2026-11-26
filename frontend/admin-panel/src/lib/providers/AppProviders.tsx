'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/users/context/AuthContext';
import { ToastProvider } from './ToastProvider';

/** Every app-wide React context, in one place. Used by app/layout.tsx. */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
