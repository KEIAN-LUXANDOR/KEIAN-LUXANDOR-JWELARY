import type { Tone } from '@/types/common';
import type { PriceBand, Product, SortKey } from '../types/productTypes';

export const SORTS: Record<SortKey, { label: string; fn: (a: Product, b: Product) => number }> = {
  featured: { label: 'Featured', fn: () => 0 },
  'price-asc': { label: 'Price: Low to High', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: High to Low', fn: (a, b) => b.price - a.price },
  name: { label: 'Name: A–Z', fn: (a, b) => a.name.localeCompare(b.name) },
};

export const PRICE_BANDS: PriceBand[] = [
  { id: 'u500', label: 'Under $500', test: (p) => p < 500 },
  { id: '500-1000', label: '$500 – $1,000', test: (p) => p >= 500 && p < 1000 },
  { id: '1000-2500', label: '$1,000 – $2,500', test: (p) => p >= 1000 && p < 2500 },
  { id: 'o2500', label: '$2,500 & above', test: (p) => p >= 2500 },
];

export const RING_SIZES = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9'];

/** Keian's four metals. `name` matches the product's metal from the backend; `label` is what customers see. */
export const METAL_SWATCHES = [
  { name: '14K Yellow Gold', label: '14K Yellow Gold', color: '#d9b45a' },
  { name: '14K Rose Gold', label: '14K Rose Gold', color: '#e2a98f' },
  { name: '14K White Gold', label: '14K White Gold', color: '#e4e4e4' },
  { name: 'Sterling Silver', label: 'Silver 925', color: '#c9ccd1' },
];

/** "Sterling Silver" → "Silver 925"; other metals unchanged. */
export const metalLabel = (metal: string): string => METAL_SWATCHES.find((m) => m.name === metal)?.label ?? metal;

/** Picks a placeholder colour when a product has no photo yet. */
export const toneForMetal = (metal = ''): Tone => {
  const m = metal.toLowerCase();
  if (m.includes('rose')) return 'rose';
  if (m.includes('yellow')) return 'gold';
  return 'silver';
};

/** "14K Rose Gold" → "14K", "Sterling Silver" → "925 Sterling", "Platinum" → "950 Platinum". */
export const metalPurity = (metal = ''): string | null => {
  const karat = metal.match(/\b(\d{1,2})K\b/i);
  if (karat) return `${karat[1]}K`;
  if (/sterling/i.test(metal)) return '925 Sterling';
  if (/platinum/i.test(metal)) return '950 Platinum';
  return null;
};

/** Every word of the query must appear in the text. */
export const matchesQuery = (text: string, query: string): boolean => {
  const t = text.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => t.includes(w));
};

export const isRing = (product: Product): boolean => /ring|band/i.test(product.type);

export const productHref = (product: Pick<Product, 'id'>): string => `/product/${product.id}`;

export interface ProductFilterState {
  metals: string[];
  prices: string[];
  sort: SortKey;
}

export const applyFilters = (products: Product[], { metals, prices, sort }: ProductFilterState): Product[] => {
  const bands = PRICE_BANDS.filter((b) => prices.includes(b.id));
  return products
    .filter((p) => !metals.length || metals.includes(p.metal))
    .filter((p) => !bands.length || bands.some((b) => b.test(p.price)))
    .sort(SORTS[sort].fn);
};

export const metalOptions = (products: Product[]): string[] => [...new Set(products.map((p) => p.metal).filter(Boolean))].sort();

/** Rows for the specifications table. Rows without a value are left out. */
export const specificationRows = (product: Product, selectedMetal = product.metal) =>
  [
    { label: 'Style #', value: product.sku },
    { label: 'Category', value: product.type },
    { label: 'Metal', value: metalLabel(selectedMetal) },
    { label: 'Metal Purity', value: metalPurity(selectedMetal) },
    { label: 'Diamond Shape', value: product.diamondShape },
    { label: 'Carat Weight', value: product.caratWeight != null ? `${product.caratWeight.toFixed(2)} ct` : undefined },
    { label: 'Diamond Color', value: product.diamondColor },
    { label: 'Diamond Clarity', value: product.diamondClarity },
  ].filter((r): r is { label: string; value: string } => Boolean(r.value));
