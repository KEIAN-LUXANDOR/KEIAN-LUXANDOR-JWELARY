import { describe, expect, it } from 'vitest';
import { monthlyRevenue, pctChange, revenue, salesBetween, salesByMetal, topProducts } from '@/features/reports/utils/analytics';
import type { Metal, Order, OrderStatus } from '@/types/models';

const order = (id: string, total: number, status: OrderStatus, createdAt: string, metal: Metal = '14K Rose Gold'): Order => ({
  id,
  number: id,
  customerId: 'c1',
  customerName: 'Test',
  email: 't@example.com',
  createdAt,
  status,
  paymentStatus: 'Captured',
  paymentMethod: 'Card',
  items: [{ productId: `p-${metal}`, name: metal, sku: 'SKU', metal, size: null, qty: 1, price: total }],
  subtotal: total,
  discount: 0,
  shipping: 0,
  tax: 0,
  total,
  couponCode: null,
  shippingAddress: { name: '', line1: '', line2: '', city: '', state: '', zip: '', country: '', phone: '' },
  trackingNumber: '',
  notes: '',
  timeline: [],
});

const now = new Date('2026-11-25T12:00:00Z');
const orders = [
  order('a', 1000, 'Delivered', '2026-11-20T10:00:00Z'),
  order('b', 500, 'Cancelled', '2026-11-21T10:00:00Z'),
  order('c', 300, 'Refunded', '2026-11-22T10:00:00Z'),
  order('d', 200, 'Processing', '2026-11-24T10:00:00Z', 'Sterling Silver'),
  order('e', 999, 'Delivered', '2026-06-01T10:00:00Z', '14K Yellow Gold'),
];

describe('sales analytics', () => {
  it('does not count cancelled or refunded orders as sales', () => {
    const last30 = salesBetween(orders, new Date('2026-10-26T12:00:00Z'), now);
    expect(last30.map((o) => o.id)).toEqual(['a', 'd']);
    expect(revenue(last30)).toBe(1200);
  });

  it('gives the % change, or null when there was nothing before', () => {
    expect(pctChange(150, 100)).toBe(50);
    expect(pctChange(50, 100)).toBe(-50);
    expect(pctChange(10, 0)).toBeNull();
  });

  it('splits sales by the four metals, always in the same order', () => {
    const byMetal = salesByMetal(orders);
    expect(byMetal.map((m) => m.label)).toEqual(['Yellow Gold', 'Rose Gold', 'White Gold', 'Silver 925']);
    expect(byMetal.map((m) => m.value)).toEqual([999, 1000, 0, 200]);
  });

  it('adds revenue into the right month buckets', () => {
    const months = monthlyRevenue(orders, 12, now);
    expect(months).toHaveLength(12);
    expect(months[11]).toEqual({ label: 'Nov', value: 1200 });
    expect(months.find((m) => m.label === 'Jun')?.value).toBe(999);
  });

  it('ranks best sellers by revenue', () => {
    expect(topProducts(orders, 2).map((t) => t.revenue)).toEqual([1000, 999]);
  });
});
