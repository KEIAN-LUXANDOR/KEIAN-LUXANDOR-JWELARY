import type { IconName } from '@/components/common/Icon';
import type { Permission } from '@/types/models';

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  permission: Permission | null;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/** Sidebar menu. Items the signed-in admin has no permission for are hidden. */
export const NAV_GROUPS: NavGroup[] = [
  { title: 'Overview', items: [{ href: '/dashboard', label: 'Dashboard', icon: 'dashboard', permission: null }] },
  {
    title: 'Catalogue',
    items: [
      { href: '/products', label: 'Products', icon: 'box', permission: 'catalog' },
      { href: '/products/categories', label: 'Categories', icon: 'tag', permission: 'catalog' },
      { href: '/specifications', label: 'Specifications', icon: 'sliders', permission: 'catalog' },
      { href: '/inventory', label: 'Inventory', icon: 'layers', permission: 'catalog' },
      { href: '/pricing', label: 'Pricing', icon: 'dollar', permission: 'catalog' },
    ],
  },
  {
    title: 'Sales',
    items: [
      { href: '/orders', label: 'Orders', icon: 'cart', permission: 'orders' },
      { href: '/customers', label: 'Customers', icon: 'users', permission: 'customers' },
      { href: '/payments', label: 'Payments', icon: 'card', permission: 'payments' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { href: '/offers', label: 'Offers', icon: 'percent', permission: 'marketing' },
      { href: '/coupons', label: 'Coupons', icon: 'ticket', permission: 'marketing' },
      { href: '/banners', label: 'Banners', icon: 'image', permission: 'marketing' },
      { href: '/reviews', label: 'Reviews', icon: 'star', permission: 'marketing' },
    ],
  },
  {
    title: 'Business',
    items: [
      { href: '/reports', label: 'Reports', icon: 'chart', permission: 'reports' },
      { href: '/users', label: 'Admin Users', icon: 'shield', permission: 'users' },
      { href: '/settings', label: 'Settings', icon: 'settings', permission: 'settings' },
    ],
  },
];

/** The most specific menu item for a page, e.g. /products/categories → Categories (not Products). */
export const activeHref = (pathname: string): string | null => {
  const all = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));
  return all.filter((h) => pathname === h || pathname.startsWith(`${h}/`)).sort((a, b) => b.length - a.length)[0] ?? null;
};
