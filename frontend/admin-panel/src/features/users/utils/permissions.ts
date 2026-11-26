import type { AdminUser, Permission } from '@/types/models';

/** Which permission each admin page needs. Pages not listed are open to every admin. */
const ROUTE_PERMISSIONS: [prefix: string, permission: Permission][] = [
  ['/products', 'catalog'],
  ['/specifications', 'catalog'],
  ['/inventory', 'catalog'],
  ['/pricing', 'catalog'],
  ['/orders', 'orders'],
  ['/customers', 'customers'],
  ['/payments', 'payments'],
  ['/offers', 'marketing'],
  ['/coupons', 'marketing'],
  ['/banners', 'marketing'],
  ['/reviews', 'marketing'],
  ['/reports', 'reports'],
  ['/users', 'users'],
  ['/settings', 'settings'],
];

export const permissionForPath = (pathname: string): Permission | null =>
  ROUTE_PERMISSIONS.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`))?.[1] ?? null;

export const can = (user: AdminUser | null, permission: Permission | null): boolean =>
  Boolean(user) && (permission === null || user!.role === 'Owner' || user!.permissions.includes(permission));
