// ─────────────────────────────────────────────────────────────
// Demo data so every admin page works before the backend has
// admin endpoints. Generated the same way every time (seeded),
// with dates relative to "now" so charts look current.
// ─────────────────────────────────────────────────────────────
import { METALS, ROLE_PERMISSIONS } from '@/lib/constants';
import type {
  AdminUser,
  Banner,
  Category,
  Coupon,
  Customer,
  Metal,
  MetalRate,
  Offer,
  Order,
  OrderStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Product,
  Review,
  SpecificationGroup,
  StoreSettings,
} from '@/types/models';
import { DAY } from '@/utils/dates';

/** Small deterministic random generator, so the demo data is the same on every computer. */
const rng = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

export interface MockDatabase {
  products: Product[];
  categories: Category[];
  specifications: SpecificationGroup[];
  metalRates: MetalRate[];
  orders: Order[];
  customers: Customer[];
  payments: Payment[];
  offers: Offer[];
  coupons: Coupon[];
  banners: Banner[];
  reviews: Review[];
  users: AdminUser[];
  settings: StoreSettings[];
}

export type CollectionName = keyof MockDatabase;

const CATEGORIES: [string, string, string][] = [
  ['Rings', 'rings', 'Statement, stackable and promise rings.'],
  ['Engagement Rings', 'engagement-rings', 'Solitaires, halos and three-stone rings.'],
  ['Wedding Bands', 'wedding-rings', 'Classic and diamond wedding bands.'],
  ['Earrings', 'earrings', 'Studs, hoops and drops.'],
  ['Necklaces', 'necklaces', 'Chains, tennis necklaces and layered looks.'],
  ['Pendants', 'pendants', 'Diamond pendants and medallions.'],
  ['Bracelets', 'bracelets', 'Tennis, bangle and chain bracelets.'],
];

const PRODUCT_NAMES: Record<string, [string, string][]> = {
  rings: [['Keian Promise Ring', 'Ring'], ['Aurelia Stacking Ring', 'Ring'], ['Lattice Cocktail Ring', 'Ring'], ['Eternal Twist Ring', 'Ring']],
  'engagement-rings': [['Lumière Halo Engagement Ring', 'Engagement Ring'], ['Solène Solitaire', 'Engagement Ring'], ['Trinity Three-Stone Ring', 'Engagement Ring']],
  'wedding-rings': [['Classic Comfort-Fit Band', 'Wedding Band'], ['Pavé Eternity Band', 'Wedding Band'], ['Milgrain Heritage Band', 'Wedding Band']],
  earrings: [['Dewdrop Diamond Studs', 'Stud Earrings'], ['Twilight Hoop Earrings', 'Hoop Earrings'], ['Cascade Drop Earrings', 'Drop Earrings'], ['Petite Huggie Hoops', 'Hoop Earrings']],
  necklaces: [['Riviera Tennis Necklace', 'Necklace'], ['Fine Cable Chain', 'Necklace'], ['Bezel Station Necklace', 'Necklace']],
  pendants: [['Celeste Pendant Necklace', 'Pendant'], ['Halo Heart Pendant', 'Pendant'], ['Initial Disc Pendant', 'Pendant']],
  bracelets: [['Riviera Tennis Bracelet', 'Bracelet'], ['Bezel Chain Bracelet', 'Bracelet'], ['Twist Bangle', 'Bangle']],
};

const IMAGE_FOR: Record<string, string> = {
  rings: '/images/ring-400.webp',
  'engagement-rings': '/images/ring-400.webp',
  'wedding-rings': '/images/ring-400.webp',
  earrings: '/images/earring-400.webp',
  necklaces: '/images/necklace-400.webp',
  pendants: '/images/pendant-400.webp',
  bracelets: '/images/bracelet-400.webp',
};

const SHAPES = ['Round', 'Oval', 'Pear', 'Emerald', 'Princess', 'Cushion'];
const COLORS = ['D', 'E', 'F', 'G', 'H'];
const CLARITIES = ['VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'];
const RING_SIZES = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9'];
const FIRST = ['Olivia', 'Emma', 'Ava', 'Sophia', 'Mia', 'Isabella', 'Amelia', 'Harper', 'Ella', 'Grace', 'Liam', 'Noah', 'James', 'Lucas', 'Ethan', 'Priya', 'Ananya', 'Aarav', 'Maya', 'Leah'];
const LAST = ['Smith', 'Johnson', 'Brown', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Lopez', 'Wilson', 'Patel', 'Shah', 'Kim', 'Nguyen', 'Clark', 'Lewis'];
const CITIES: [string, string][] = [['New York', 'NY'], ['Los Angeles', 'CA'], ['Chicago', 'IL'], ['Houston', 'TX'], ['Dallas', 'TX'], ['Miami', 'FL'], ['Seattle', 'WA'], ['Boston', 'MA'], ['Atlanta', 'GA'], ['San Jose', 'CA']];
const REVIEW_TEXT: [number, string, string][] = [
  [5, 'Absolutely stunning', 'Even more beautiful in person. The diamonds catch the light everywhere.'],
  [5, 'Perfect gift', 'Bought this for our anniversary and she has not taken it off.'],
  [4, 'Lovely piece', 'Beautiful finish. Shipping took a day longer than expected.'],
  [5, 'Great quality', 'Feels solid and well made. Packaging was elegant too.'],
  [3, 'Nice but smaller', 'Pretty, but smaller than it looked in the photos.'],
  [4, 'Very happy', 'Sized perfectly and arrived quickly.'],
  [2, 'Clasp is fiddly', 'Looks great but the clasp is hard to close on my own.'],
];

// Base price per gram of finished piece, by metal (USD) — used to make prices believable.
const PRICE_PER_GRAM: Record<Metal, number> = {
  '14K Yellow Gold': 95,
  '14K Rose Gold': 95,
  '14K White Gold': 100,
  'Sterling Silver': 18,
};

export function createSeedData(now = new Date()): MockDatabase {
  const r = rng(20261125);
  const pick = <T,>(list: T[]): T => list[Math.floor(r() * list.length)];
  const between = (min: number, max: number) => min + r() * (max - min);
  const iso = (msAgo: number) => new Date(now.getTime() - msAgo).toISOString();

  const categories: Category[] = CATEGORIES.map(([name, slug, description], i) => ({
    id: `cat_${slug}`,
    name,
    slug,
    description,
    active: true,
    position: i + 1,
  }));

  // ── Products: every name in two or three of the four metals ──
  const products: Product[] = [];
  let n = 1;
  for (const [category, names] of Object.entries(PRODUCT_NAMES)) {
    for (const [name, type] of names) {
      const metals = METALS.filter(() => r() > 0.45).map((m) => m.value);
      if (metals.length === 0) metals.push(pick(METALS).value);
      for (const metal of metals) {
        const weight = Math.round(between(2, 9) * 10) / 10;
        const isRing = /\b(ring|band)s?\b/i.test(type);
        const price = Math.round((weight * PRICE_PER_GRAM[metal] + between(150, 2200)) / 10) * 10 - 1;
        const created = iso(between(20, 400) * DAY);
        const metalShort = METALS.find((m) => m.value === metal)!.label;
        products.push({
          id: `prd_${n}`,
          sku: `KL-${category.slice(0, 2).toUpperCase()}-${String(n).padStart(3, '0')}`,
          name: `${name} — ${metalShort}`,
          type,
          category,
          metal,
          weightGrams: weight,
          price,
          compareAtPrice: r() > 0.8 ? Math.round(price * 1.15) : null,
          status: r() > 0.9 ? 'draft' : r() > 0.95 ? 'archived' : 'active',
          badge: r() > 0.8 ? pick(['New', 'Bestseller', 'Limited']) : '',
          description: `${name} in ${metalShort.toLowerCase()}, finished by hand in our atelier.`,
          images: [IMAGE_FOR[category]],
          tags: [category, 'fine-jewelry', ...(r() > 0.6 ? ['gifts'] : [])],
          stock: Math.floor(between(0, 40)),
          lowStockThreshold: 5,
          specs: {
            diamondShape: metal === 'Sterling Silver' && r() > 0.5 ? '' : pick(SHAPES),
            caratWeight: Math.round(between(0.1, 2.2) * 100) / 100,
            diamondColor: pick(COLORS),
            diamondClarity: pick(CLARITIES),
            ringSizes: isRing ? RING_SIZES : [],
          },
          createdAt: created,
          updatedAt: created,
        });
        n++;
      }
    }
  }

  // ── Customers ──
  const customers: Customer[] = Array.from({ length: 36 }, (_, i) => {
    const first = FIRST[i % FIRST.length];
    const last = pick(LAST);
    const [city, state] = pick(CITIES);
    return {
      id: `cus_${i + 1}`,
      firstName: first,
      lastName: last,
      email: `${first}.${last}${i}@example.com`.toLowerCase(),
      phone: `+1 (${200 + Math.floor(r() * 700)}) 555-${String(1000 + Math.floor(r() * 8999))}`,
      city,
      state,
      country: 'United States',
      createdAt: iso(between(5, 420) * DAY),
      status: r() > 0.95 ? 'blocked' : 'active',
      marketingOptIn: r() > 0.4,
      notes: '',
    };
  });

  // ── Orders and their payments (last 12 months) ──
  const orders: Order[] = [];
  const payments: Payment[] = [];
  const activeProducts = products.filter((p) => p.status === 'active');
  for (let i = 0; i < 140; i++) {
    const customer = pick(customers);
    const ageDays = Math.pow(r(), 1.3) * 360; // more recent orders than old ones
    const createdAt = iso(ageDays * DAY + between(0, DAY));
    const items = Array.from({ length: r() > 0.75 ? 2 : 1 }, () => {
      const p = pick(activeProducts);
      return { productId: p.id, name: p.name, sku: p.sku, metal: p.metal, size: p.specs.ringSizes.length ? pick(['5', '6', '6.5', '7']) : null, qty: r() > 0.9 ? 2 : 1, price: p.price };
    });
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const couponCode = r() > 0.85 ? 'WELCOME10' : null;
    const discount = couponCode ? Math.round(subtotal * 0.1) : 0;
    const tax = Math.round((subtotal - discount) * 0.07);
    const total = subtotal - discount + tax;

    let status: OrderStatus;
    if (ageDays < 2) status = pick(['Pending', 'Processing']);
    else if (ageDays < 6) status = pick(['Processing', 'Shipped']);
    else status = r() > 0.92 ? pick(['Cancelled', 'Refunded']) : 'Delivered';
    const method: PaymentMethod = r() > 0.75 ? 'PayPal' : r() > 0.9 ? 'Bank Transfer' : 'Card';
    const paymentStatus: PaymentStatus =
      status === 'Refunded' ? 'Refunded' : status === 'Cancelled' ? (r() > 0.5 ? 'Failed' : 'Refunded') : status === 'Pending' && method === 'Bank Transfer' ? 'Pending' : 'Captured';

    const timeline = [{ status: 'Pending' as OrderStatus, at: createdAt, note: 'Order placed' }];
    const step = (s: OrderStatus, hours: number, note: string) => timeline.push({ status: s, at: new Date(new Date(createdAt).getTime() + hours * 3600_000).toISOString(), note });
    if (status !== 'Pending') step('Processing', 3, 'Payment confirmed');
    if (['Shipped', 'Delivered'].includes(status)) step('Shipped', 30, 'Handed to courier');
    if (status === 'Delivered') step('Delivered', 96, 'Delivered');
    if (status === 'Cancelled') step('Cancelled', 10, 'Cancelled at customer request');
    if (status === 'Refunded') step('Refunded', 200, 'Returned and refunded');

    const number = `KL-${10001 + i}`;
    const id = `ord_${i + 1}`;
    orders.push({
      id,
      number,
      customerId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      createdAt,
      status,
      paymentStatus,
      paymentMethod: method,
      items,
      subtotal,
      discount,
      shipping: 0,
      tax,
      total,
      couponCode,
      shippingAddress: {
        name: `${customer.firstName} ${customer.lastName}`,
        line1: `${100 + Math.floor(r() * 900)} ${pick(['Park Ave', 'Main St', 'Oak Lane', 'Madison Ave', 'Sunset Blvd'])}`,
        line2: '',
        city: customer.city,
        state: customer.state,
        zip: String(10000 + Math.floor(r() * 89999)),
        country: 'United States',
        phone: customer.phone,
      },
      trackingNumber: ['Shipped', 'Delivered'].includes(status) ? `1Z${Math.floor(r() * 1e9)}` : '',
      notes: '',
      timeline,
    });
    payments.push({
      id: `pay_${i + 1}`,
      orderId: id,
      orderNumber: number,
      customerName: `${customer.firstName} ${customer.lastName}`,
      amount: total,
      method,
      status: paymentStatus,
      provider: method === 'PayPal' ? 'PayPal' : method === 'Card' ? 'Stripe' : 'Bank',
      reference: `${method === 'PayPal' ? 'PP' : method === 'Card' ? 'pi' : 'BT'}_${Math.floor(r() * 1e10).toString(36)}`,
      createdAt,
    });
  }
  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  payments.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const specifications: SpecificationGroup[] = [
    { id: 'spec_metal', key: 'metal', name: 'Metal', description: 'Metals Keian makes jewellery in.', values: METALS.map((m) => m.label) },
    { id: 'spec_purity', key: 'purity', name: 'Metal Purity', description: 'Gold karat and silver fineness.', values: ['14K', '18K', '925 Sterling'] },
    { id: 'spec_shape', key: 'diamondShape', name: 'Diamond Shape', description: 'Cut shapes for centre and accent stones.', values: SHAPES.concat(['Marquise', 'Radiant']) },
    { id: 'spec_color', key: 'diamondColor', name: 'Diamond Color', description: 'GIA colour grades offered.', values: COLORS },
    { id: 'spec_clarity', key: 'diamondClarity', name: 'Diamond Clarity', description: 'GIA clarity grades offered.', values: ['IF', ...CLARITIES, 'SI2'] },
    { id: 'spec_ring', key: 'ringSize', name: 'Ring Size (US)', description: 'Ring sizes available to order.', values: RING_SIZES },
    { id: 'spec_finish', key: 'finish', name: 'Finish', description: 'Surface finishes.', values: ['High polish', 'Satin', 'Hammered'] },
  ];

  const metalRates: MetalRate[] = [
    { id: 'rate_yellow', metal: '14K Yellow Gold', ratePerGram: 62.4, updatedAt: iso(1 * DAY) },
    { id: 'rate_rose', metal: '14K Rose Gold', ratePerGram: 62.1, updatedAt: iso(1 * DAY) },
    { id: 'rate_white', metal: '14K White Gold', ratePerGram: 64.8, updatedAt: iso(1 * DAY) },
    { id: 'rate_silver', metal: 'Sterling Silver', ratePerGram: 0.98, updatedAt: iso(1 * DAY) },
  ];

  const offers: Offer[] = [
    { id: 'off_1', name: 'Holiday Gifting', description: '15% off all gifts for the holidays.', discountType: 'percent', value: 15, appliesTo: 'all', target: '', startsAt: iso(-5 * DAY), endsAt: iso(-40 * DAY), active: true },
    { id: 'off_2', name: 'Silver Season', description: '$50 off Silver 925 pieces.', discountType: 'fixed', value: 50, appliesTo: 'metal', target: 'Sterling Silver', startsAt: iso(10 * DAY), endsAt: iso(-20 * DAY), active: true },
    { id: 'off_3', name: 'Bridal Week', description: '10% off engagement rings.', discountType: 'percent', value: 10, appliesTo: 'category', target: 'engagement-rings', startsAt: iso(90 * DAY), endsAt: iso(83 * DAY), active: false },
  ];

  const coupons: Coupon[] = [
    { id: 'cpn_1', code: 'WELCOME10', description: '10% off a first order', discountType: 'percent', value: 10, minOrder: 0, usageLimit: null, usedCount: orders.filter((o) => o.couponCode).length, expiresAt: iso(-180 * DAY), active: true },
    { id: 'cpn_2', code: 'GIFT50', description: '$50 off orders over $500', discountType: 'fixed', value: 50, minOrder: 500, usageLimit: 200, usedCount: 37, expiresAt: iso(-30 * DAY), active: true },
    { id: 'cpn_3', code: 'BRIDAL15', description: '15% off bridal over $2,000', discountType: 'percent', value: 15, minOrder: 2000, usageLimit: 50, usedCount: 50, expiresAt: iso(-60 * DAY), active: true },
    { id: 'cpn_4', code: 'SUMMER20', description: 'Summer sale', discountType: 'percent', value: 20, minOrder: 0, usageLimit: 500, usedCount: 212, expiresAt: iso(70 * DAY), active: false },
  ];

  const banners: Banner[] = [
    { id: 'ban_1', title: 'Brilliance, Redefined', subtitle: 'The Keian Signature Collection', image: '/images/hero-banner.webp', ctaLabel: 'Shop Signature', ctaLink: '/collections/signature', placement: 'home-hero', position: 1, active: true },
    { id: 'ban_2', title: 'Made for her style', subtitle: 'Everyday diamonds in four metals', image: '/images/earring-400.webp', ctaLabel: 'Shop Earrings', ctaLink: '/earrings', placement: 'home-campaign', position: 1, active: true },
    { id: 'ban_3', title: 'Our Craft', subtitle: 'Finished by hand, built to last', image: '/images/ring-400.webp', ctaLabel: 'Our Story', ctaLink: '/about-us', placement: 'home-story', position: 1, active: true },
  ];

  const reviews: Review[] = Array.from({ length: 42 }, (_, i): Review => {
    const p = pick(activeProducts);
    const c = pick(customers);
    const [rating, title, body] = pick(REVIEW_TEXT);
    const ageDays = between(0, 200);
    return {
      id: `rev_${i + 1}`,
      productId: p.id,
      productName: p.name,
      customerName: `${c.firstName} ${c.lastName.charAt(0)}.`,
      rating,
      title,
      body,
      createdAt: iso(ageDays * DAY),
      status: ageDays < 10 ? 'pending' : rating <= 2 && r() > 0.5 ? 'hidden' : 'approved',
    };
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const users: AdminUser[] = [
    { id: 'usr_1', name: 'Amol', email: 'admin@keianluxandor.com', role: 'Owner', permissions: ROLE_PERMISSIONS.Owner, active: true, lastLoginAt: iso(2 * 3600_000) },
    { id: 'usr_2', name: 'Riya Mehta', email: 'riya@keianluxandor.com', role: 'Manager', permissions: ROLE_PERMISSIONS.Manager, active: true, lastLoginAt: iso(1 * DAY) },
    { id: 'usr_3', name: 'Daniel Cruz', email: 'daniel@keianluxandor.com', role: 'Staff', permissions: ROLE_PERMISSIONS.Staff, active: true, lastLoginAt: iso(3 * DAY) },
    { id: 'usr_4', name: 'Former Staff', email: 'old.staff@keianluxandor.com', role: 'Staff', permissions: ['orders'], active: false, lastLoginAt: iso(120 * DAY) },
  ];

  const settings: StoreSettings[] = [
    {
      id: 'store',
      storeName: 'Keian Luxandor',
      supportEmail: 'info@keianluxandor.com',
      supportPhone: '+91 9898552297',
      currency: 'USD',
      taxPercent: 7,
      shippingFlat: 0,
      freeShippingThreshold: 0,
      lowStockThreshold: 5,
      orderPrefix: 'KL-',
      makingChargePercent: 18,
      notifyNewOrder: true,
      notifyLowStock: true,
      notifyNewReview: false,
    },
  ];

  return { products, categories, specifications, metalRates, orders, customers, payments, offers, coupons, banners, reviews, users, settings };
}
