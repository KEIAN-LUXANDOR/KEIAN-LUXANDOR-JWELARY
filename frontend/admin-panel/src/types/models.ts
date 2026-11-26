// ─────────────────────────────────────────────────────────────
// Data definitions shared by the whole admin panel.
// Keep these in step with the Spring Boot DTOs.
// ─────────────────────────────────────────────────────────────

/** Anything stored in a list with its own id. */
export interface Entity {
  id: string;
}

// ── Catalogue ────────────────────────────────────────────────

/** Metal names exactly as the backend stores them. */
export type Metal = '14K Yellow Gold' | '14K Rose Gold' | '14K White Gold' | 'Sterling Silver';

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ProductSpecs {
  diamondShape: string;
  caratWeight: number | null;
  diamondColor: string;
  diamondClarity: string;
  /** Ring sizes this product is made in (empty for non-rings). */
  ringSizes: string[];
}

export interface Product extends Entity {
  sku: string;
  name: string;
  type: string; // "Ring", "Stud Earrings", …
  category: string; // category slug, e.g. "rings"
  metal: Metal;
  weightGrams: number;
  price: number;
  compareAtPrice: number | null;
  status: ProductStatus;
  badge: string;
  description: string;
  images: string[];
  tags: string[];
  stock: number;
  lowStockThreshold: number;
  specs: ProductSpecs;
  createdAt: string;
  updatedAt: string;
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export interface Category extends Entity {
  name: string;
  slug: string;
  description: string;
  active: boolean;
  position: number;
}

/** A list of allowed values for one specification, e.g. Diamond Shape → Round, Oval … */
export interface SpecificationGroup extends Entity {
  name: string;
  key: 'metal' | 'purity' | 'diamondShape' | 'diamondColor' | 'diamondClarity' | 'ringSize' | 'finish';
  description: string;
  values: string[];
}

// ── Pricing ──────────────────────────────────────────────────

export interface MetalRate extends Entity {
  metal: Metal;
  ratePerGram: number; // USD per gram
  updatedAt: string;
}

// ── Orders & customers ───────────────────────────────────────

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
export type PaymentStatus = 'Captured' | 'Pending' | 'Refunded' | 'Failed';
export type PaymentMethod = 'Card' | 'PayPal' | 'Bank Transfer';

export interface Address {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  metal: Metal;
  size: string | null;
  qty: number;
  price: number;
}

export interface OrderEvent {
  status: OrderStatus;
  at: string;
  note: string;
}

export interface Order extends Entity {
  number: string; // "KL-10045"
  customerId: string;
  customerName: string;
  email: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode: string | null;
  shippingAddress: Address;
  trackingNumber: string;
  notes: string;
  timeline: OrderEvent[];
}

export interface Customer extends Entity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  createdAt: string;
  status: 'active' | 'blocked';
  marketingOptIn: boolean;
  notes: string;
}

export interface Payment extends Entity {
  orderId: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  provider: string;
  reference: string;
  createdAt: string;
}

// ── Marketing ────────────────────────────────────────────────

export type DiscountType = 'percent' | 'fixed';

export interface Offer extends Entity {
  name: string;
  description: string;
  discountType: DiscountType;
  value: number;
  appliesTo: 'all' | 'category' | 'metal';
  target: string; // category slug or metal, when appliesTo isn't "all"
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface Coupon extends Entity {
  code: string;
  description: string;
  discountType: DiscountType;
  value: number;
  minOrder: number;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

export type BannerPlacement = 'home-hero' | 'home-campaign' | 'home-story';

export interface Banner extends Entity {
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaLink: string;
  placement: BannerPlacement;
  position: number;
  active: boolean;
}

export type ReviewStatus = 'pending' | 'approved' | 'hidden';

export interface Review extends Entity {
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  status: ReviewStatus;
}

// ── Admin users & settings ───────────────────────────────────

export type Permission = 'catalog' | 'orders' | 'customers' | 'payments' | 'marketing' | 'reports' | 'users' | 'settings';
export type AdminRole = 'Owner' | 'Manager' | 'Staff';

export interface AdminUser extends Entity {
  name: string;
  email: string;
  role: AdminRole;
  permissions: Permission[];
  active: boolean;
  lastLoginAt: string | null;
}

export interface StoreSettings extends Entity {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  taxPercent: number;
  shippingFlat: number;
  freeShippingThreshold: number;
  lowStockThreshold: number;
  orderPrefix: string;
  makingChargePercent: number;
  notifyNewOrder: boolean;
  notifyLowStock: boolean;
  notifyNewReview: boolean;
}
