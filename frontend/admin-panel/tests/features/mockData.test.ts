import { describe, expect, it } from 'vitest';
import { createSeedData } from '@/lib/mock/seed';
import { METALS } from '@/lib/constants';

describe('demo data', () => {
  const now = new Date('2026-11-25T12:00:00Z');
  const db = createSeedData(now);

  it('only uses Keian’s four metals', () => {
    const allowed = METALS.map((m) => m.value);
    expect(db.products.every((p) => allowed.includes(p.metal))).toBe(true);
    expect(db.orders.flatMap((o) => o.items).every((i) => allowed.includes(i.metal))).toBe(true);
  });

  it('is the same every time (so tests and screenshots match)', () => {
    expect(createSeedData(now).products.map((p) => p.sku)).toEqual(db.products.map((p) => p.sku));
  });

  it('has one payment for every order, with matching totals', () => {
    expect(db.payments).toHaveLength(db.orders.length);
    for (const p of db.payments) expect(p.amount).toBe(db.orders.find((o) => o.id === p.orderId)!.total);
  });

  it('adds up every order correctly', () => {
    for (const o of db.orders) {
      expect(o.subtotal).toBe(o.items.reduce((s, i) => s + i.price * i.qty, 0));
      expect(o.total).toBe(o.subtotal - o.discount + o.shipping + o.tax);
    }
  });

  it('has unique SKUs', () => {
    expect(new Set(db.products.map((p) => p.sku)).size).toBe(db.products.length);
  });
});

it('only gives ring sizes to rings and bands', () => {
  const db = createSeedData(new Date('2026-11-25T12:00:00Z'));
  for (const p of db.products) expect(p.specs.ringSizes.length > 0).toBe(/\b(ring|band)s?\b/i.test(p.type));
});
