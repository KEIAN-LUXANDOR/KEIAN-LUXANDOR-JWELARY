// Fixed lists used across the admin panel.
import type { AdminRole, Metal, OrderStatus, PaymentStatus, Permission, ProductStatus, ReviewStatus } from '@/types/models';

/** Keian's four metals: value as stored in the backend, label as shown to people. */
export const METALS: { value: Metal; label: string; color: string; purity: string }[] = [
  { value: '14K Yellow Gold', label: 'Yellow Gold', color: '#d9b45a', purity: '14K' },
  { value: '14K Rose Gold', label: 'Rose Gold', color: '#e2a98f', purity: '14K' },
  { value: '14K White Gold', label: 'White Gold', color: '#e4e4e4', purity: '14K' },
  { value: 'Sterling Silver', label: 'Silver 925', color: '#c9ccd1', purity: '925' },
];

export const metalLabel = (metal: string): string => METALS.find((m) => m.value === metal)?.label ?? metal;
export const metalColor = (metal: string): string => METALS.find((m) => m.value === metal)?.color ?? '#ccc';

export const PRODUCT_STATUSES: ProductStatus[] = ['active', 'draft', 'archived'];
export const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
export const PAYMENT_STATUSES: PaymentStatus[] = ['Captured', 'Pending', 'Refunded', 'Failed'];
export const REVIEW_STATUSES: ReviewStatus[] = ['pending', 'approved', 'hidden'];

export const PERMISSIONS: { value: Permission; label: string; description: string }[] = [
  { value: 'catalog', label: 'Catalogue', description: 'Products, categories, specifications, inventory, pricing' },
  { value: 'orders', label: 'Orders', description: 'View and update customer orders' },
  { value: 'customers', label: 'Customers', description: 'View customer details' },
  { value: 'payments', label: 'Payments', description: 'View payments and refunds' },
  { value: 'marketing', label: 'Marketing', description: 'Offers, coupons, banners, reviews' },
  { value: 'reports', label: 'Reports', description: 'Sales and business reports' },
  { value: 'users', label: 'Admin users', description: 'Add admin users and change permissions' },
  { value: 'settings', label: 'Settings', description: 'Store and business settings' },
];

export const ALL_PERMISSIONS: Permission[] = PERMISSIONS.map((p) => p.value);

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  Owner: ALL_PERMISSIONS,
  Manager: ['catalog', 'orders', 'customers', 'payments', 'marketing', 'reports'],
  Staff: ['catalog', 'orders', 'customers'],
};

export const ADMIN_ROLES: AdminRole[] = ['Owner', 'Manager', 'Staff'];
