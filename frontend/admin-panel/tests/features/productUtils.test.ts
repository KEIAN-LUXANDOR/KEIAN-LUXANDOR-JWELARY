import { describe, expect, it } from 'vitest';
import { emptyProduct, isRingType, stockStatus, validateProduct } from '@/features/products/utils/productUtils';

describe('product validation', () => {
  const valid = { ...emptyProduct(), name: 'Keian Promise Ring', sku: 'KL-RI-900', price: 890, stock: 3 };

  it('accepts a complete product', () => {
    expect(validateProduct(valid)).toEqual({});
  });

  it('needs a name, SKU and a price above 0', () => {
    const errors = validateProduct({ ...valid, name: ' ', sku: '', price: 0 });
    expect(Object.keys(errors).sort()).toEqual(['name', 'price', 'sku']);
  });

  it('rejects a SKU another product already uses (any letter case)', () => {
    expect(validateProduct(valid, ['kl-ri-900']).sku).toMatch(/already uses/);
  });

  it('needs the compare-at price to be higher than the price', () => {
    expect(validateProduct({ ...valid, compareAtPrice: 800 }).compareAtPrice).toBeDefined();
    expect(validateProduct({ ...valid, compareAtPrice: 1000 }).compareAtPrice).toBeUndefined();
  });

  it('only allows whole, non-negative stock', () => {
    expect(validateProduct({ ...valid, stock: -1 }).stock).toBeDefined();
    expect(validateProduct({ ...valid, stock: 1.5 }).stock).toBeDefined();
  });
});

describe('stock status', () => {
  it.each([
    [0, 'Out of stock'],
    [5, 'Low stock'],
    [6, 'In stock'],
  ])('%i in stock with alert at 5 → %s', (stock, expected) => {
    expect(stockStatus({ stock, lowStockThreshold: 5 })).toBe(expected);
  });
});

it('recognises ring types (for ring sizes)', () => {
  expect(isRingType('Engagement Ring')).toBe(true);
  expect(isRingType('Wedding Band')).toBe(true);
  expect(isRingType('Stud Earrings')).toBe(false);
});
