// ─────────────────────────────────────────────────────────────
// Admin sign-in.
// Backend (NEXT_PUBLIC_ADMIN_API=true):
//   POST /api/admin/auth/login            { email, password } → { token, user }
//   POST /api/admin/auth/forgot-password  { email }
//   GET  /api/admin/auth/me               → AdminUser
//
// Demo mode (no backend): sign in with any active admin user's email
// and the demo password below. DEMO ONLY — never ship this to production.
// ─────────────────────────────────────────────────────────────
import { api, authToken, useBackend } from '@/services/apiClient';
import { mockDb } from '@/lib/mock/db';
import type { AdminUser } from '@/types/models';

export const DEMO_EMAIL = 'admin@keianluxandor.com';
export const DEMO_PASSWORD = 'keian-admin';

const SESSION_KEY = 'kl-admin.session';

export class AuthError extends Error {}

export async function login(email: string, password: string): Promise<AdminUser> {
  if (useBackend) {
    const { token, user } = await api.post<{ token: string; user: AdminUser }>('/admin/auth/login', { email, password });
    authToken.set(token);
    return user;
  }
  const users = await mockDb.list('users');
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || password !== DEMO_PASSWORD) throw new AuthError('Email or password is incorrect.');
  if (!user.active) throw new AuthError('This admin account is switched off. Ask the store owner to turn it back on.');
  const signedIn = await mockDb.update('users', user.id, { lastLoginAt: new Date().toISOString() });
  window.localStorage.setItem(SESSION_KEY, signedIn.id);
  return signedIn;
}

/** The admin who is signed in on this browser, or null. */
export async function currentUser(): Promise<AdminUser | null> {
  if (useBackend) {
    if (!authToken.get()) return null;
    try {
      return await api.get<AdminUser>('/admin/auth/me');
    } catch {
      authToken.set(null);
      return null;
    }
  }
  const id = window.localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const user = await mockDb.get('users', id);
  return user && user.active ? user : null;
}

export async function logout(): Promise<void> {
  if (useBackend) authToken.set(null);
  else window.localStorage.removeItem(SESSION_KEY);
}

/** Always answers the same way, so nobody can find out which emails have accounts. */
export async function requestPasswordReset(email: string): Promise<void> {
  if (useBackend) {
    await api.post<void>('/admin/auth/forgot-password', { email });
    return;
  }
  await new Promise((r) => setTimeout(r, 300));
}
