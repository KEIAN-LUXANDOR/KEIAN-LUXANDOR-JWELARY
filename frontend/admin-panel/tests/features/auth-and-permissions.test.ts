import { beforeEach, describe, expect, it } from 'vitest';
import { mockDb } from '@/lib/mock/db';
import { currentUser, DEMO_EMAIL, DEMO_PASSWORD, login, logout } from '@/features/users/services/authService';
import { can, permissionForPath } from '@/features/users/utils/permissions';
import type { AdminUser } from '@/types/models';

describe('admin sign-in (demo mode)', () => {
  beforeEach(() => mockDb.reset());

  it('signs in with the demo password and remembers the session', async () => {
    const user = await login(DEMO_EMAIL, DEMO_PASSWORD);
    expect(user.role).toBe('Owner');
    expect((await currentUser())?.id).toBe(user.id);
    await logout();
    expect(await currentUser()).toBeNull();
  });

  it('refuses a wrong password', async () => {
    await expect(login(DEMO_EMAIL, 'nope')).rejects.toThrow('Email or password is incorrect.');
  });

  it('refuses a switched-off admin account', async () => {
    await expect(login('old.staff@keianluxandor.com', DEMO_PASSWORD)).rejects.toThrow(/switched off/);
  });
});

describe('permissions', () => {
  const staff: AdminUser = { id: 's', name: 'S', email: 's@x.com', role: 'Staff', permissions: ['catalog', 'orders'], active: true, lastLoginAt: null };
  const owner: AdminUser = { ...staff, id: 'o', role: 'Owner', permissions: [] };

  it('maps pages to the permission they need', () => {
    expect(permissionForPath('/products/categories')).toBe('catalog');
    expect(permissionForPath('/orders/ord_1')).toBe('orders');
    expect(permissionForPath('/dashboard')).toBeNull();
  });

  it('lets staff into their areas only; owners everywhere', () => {
    expect(can(staff, 'orders')).toBe(true);
    expect(can(staff, 'settings')).toBe(false);
    expect(can(owner, 'settings')).toBe(true);
    expect(can(null, null)).toBe(false);
  });
});
