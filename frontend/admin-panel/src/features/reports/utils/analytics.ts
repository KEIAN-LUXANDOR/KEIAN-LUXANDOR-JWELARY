// Sales numbers worked out from orders. Used by the Dashboard and Reports pages.
// (When the backend has a reports endpoint, these can move to the server.)
import { METALS, metalLabel } from '@/lib/constants';
import type { Category, Order, Product } from '@/types/models';
import { DAY, isWithin, lastMonths, monthKey } from '@/utils/dates';

/** Cancelled and refunded orders don't count as sales. */
export const isSale = (o: Order) => o.status !== 'Cancelled' && o.status !== 'Refunded';

export const salesBetween = (orders: Order[], from: Date, to = new Date()) => orders.filter((o) => isSale(o) && isWithin(o.createdAt, from, to));

export const revenue = (orders: Order[]) => orders.reduce((s, o) => s + o.total, 0);

/** % change from previous to current. null when there's nothing to compare with. */
export const pctChange = (current: number, previous: number): number | null => (previous > 0 ? ((current - previous) / previous) * 100 : null);

export const monthlyRevenue = (orders: Order[], months: number, now = new Date()) => {
  const buckets = lastMonths(months, now);
  const sums: Record<string, number> = Object.fromEntries(buckets.map((b) => [b.key, 0]));
  for (const o of orders) if (isSale(o) && monthKey(o.createdAt) in sums) sums[monthKey(o.createdAt)] += o.total;
  return buckets.map((b) => ({ label: b.label, value: Math.round(sums[b.key]) }));
};

export const dailyRevenue = (orders: Order[], days: number, now = new Date()) => {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));
  const points = Array.from({ length: days }, (_, i) => {
    const d = new Date(start.getTime() + i * DAY);
    return { key: d.toDateString(), label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: 0 };
  });
  const index = Object.fromEntries(points.map((p, i) => [p.key, i]));
  for (const o of orders) {
    if (!isSale(o)) continue;
    const i = index[new Date(o.createdAt).toDateString()];
    if (i !== undefined) points[i].value += o.total;
  }
  return points.map(({ label, value }) => ({ label, value: Math.round(value) }));
};

/** Sales by metal (item value), always in the order Yellow, Rose, White, Silver 925. */
export const salesByMetal = (orders: Order[]) => {
  const sums: Record<string, number> = {};
  for (const o of orders) if (isSale(o)) for (const i of o.items) sums[i.metal] = (sums[i.metal] ?? 0) + i.price * i.qty;
  return METALS.map((m) => ({ label: metalLabel(m.value), value: Math.round(sums[m.value] ?? 0), color: m.color }));
};

export const salesByCategory = (orders: Order[], products: Product[], categories: Category[]) => {
  const categoryOf = Object.fromEntries(products.map((p) => [p.id, p.category]));
  const sums: Record<string, number> = {};
  for (const o of orders) if (isSale(o)) for (const i of o.items) {
    const c = categoryOf[i.productId] ?? 'other';
    sums[c] = (sums[c] ?? 0) + i.price * i.qty;
  }
  return categories
    .map((c) => ({ label: c.name, value: Math.round(sums[c.slug] ?? 0) }))
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value);
};

export interface TopProduct {
  productId: string;
  name: string;
  sku: string;
  units: number;
  revenue: number;
}

export const topProducts = (orders: Order[], limit = 5): TopProduct[] => {
  const map: Record<string, TopProduct> = {};
  for (const o of orders) if (isSale(o)) for (const i of o.items) {
    const t = (map[i.productId] ??= { productId: i.productId, name: i.name, sku: i.sku, units: 0, revenue: 0 });
    t.units += i.qty;
    t.revenue += i.price * i.qty;
  }
  return Object.values(map)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
};
