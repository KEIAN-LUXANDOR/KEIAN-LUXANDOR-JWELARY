import type { MetalRate, Product } from '@/types/models';

/**
 * Suggested selling price from today's metal rate:
 *   metal value = weight × rate per gram
 *   price       = metal value × (1 + making charge %) + stone value
 * Rounded to end in 9, like the rest of the catalogue.
 */
export const suggestedPrice = (weightGrams: number, ratePerGram: number, makingChargePercent: number, stoneValue = 0): number => {
  const raw = weightGrams * ratePerGram * (1 + makingChargePercent / 100) + stoneValue;
  return raw <= 0 ? 0 : Math.max(9, Math.round(raw / 10) * 10 - 1);
};

export const rateFor = (rates: MetalRate[], metal: string): number => rates.find((r) => r.metal === metal)?.ratePerGram ?? 0;

/** Product price after a percentage change, rounded to end in 9. */
export const adjustPrice = (price: number, percent: number): number => Math.max(9, Math.round((price * (1 + percent / 100)) / 10) * 10 - 1);

/** How much of the price is the metal itself. */
export const metalShare = (p: Pick<Product, 'weightGrams' | 'price' | 'metal'>, rates: MetalRate[]): number =>
  p.price > 0 ? Math.min(100, ((p.weightGrams * rateFor(rates, p.metal)) / p.price) * 100) : 0;
