import { describe, expect, it } from 'vitest';
import { adjustPrice, rateFor, suggestedPrice } from '@/features/pricing/utils/pricing';
import type { MetalRate } from '@/types/models';

describe('pricing', () => {
  it('suggests metal value plus making charge, rounded to end in 9', () => {
    // 5 g × $60/g = $300, + 20% making = $360 → $359
    expect(suggestedPrice(5, 60, 20)).toBe(359);
  });

  it('suggests nothing when there is no weight or rate', () => {
    expect(suggestedPrice(0, 60, 20)).toBe(0);
    expect(suggestedPrice(5, 0, 20)).toBe(0);
  });

  it('changes prices by a percentage and keeps the 9 ending', () => {
    expect(adjustPrice(1999, 10)).toBe(2199);
    expect(adjustPrice(1999, -10)).toBe(1799);
  });

  it('finds the rate for a metal', () => {
    const rates: MetalRate[] = [{ id: 'r', metal: 'Sterling Silver', ratePerGram: 0.98, updatedAt: '' }];
    expect(rateFor(rates, 'Sterling Silver')).toBe(0.98);
    expect(rateFor(rates, '14K Rose Gold')).toBe(0);
  });
});
