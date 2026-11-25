// ─────────────────────────────────────────────────────────────
// Demo catalogue used by the search box (ids like "rings--0").
// Real products come from the Spring Boot backend (productService.ts).
// ─────────────────────────────────────────────────────────────
import type { Tone } from '@/types/common';
import type { Product } from '../types/productTypes';

const METALS: { name: string; tone: Tone }[] = [
  { name: '14K Yellow Gold', tone: 'gold' },
  { name: '14K White Gold', tone: 'silver' },
  { name: '14K Rose Gold', tone: 'rose' },
  { name: 'Sterling Silver', tone: 'silver' },
  { name: 'Platinum', tone: 'silver' },
];

const STYLES = ['Diamond', 'Halo', 'Pavé', 'Twisted', 'Bezel Set', 'Beaded', 'Floral', 'Classic', 'Cluster', 'Vintage', 'Sculpted', 'Lattice'];

const TYPE_RULES: [string, string][] = [
  ['cufflink', 'Cufflinks'],
  ['money-clip', 'Money Clip'],
  ['earring', 'Earrings'],
  ['stud', 'Stud Earrings'],
  ['hoop', 'Hoop Earrings'],
  ['bracelet', 'Bracelet'],
  ['bangle', 'Bangle'],
  ['anklet', 'Anklet'],
  ['necklace', 'Necklace'],
  ['pendant', 'Pendant'],
  ['engagement', 'Engagement Ring'],
  ['wedding', 'Wedding Band'],
  ['band', 'Wedding Band'],
  ['ring', 'Ring'],
];

const ALL_TYPES = ['Ring', 'Earrings', 'Bracelet', 'Necklace', 'Pendant', 'Bangle'];

const hash = (str: string): number => [...str].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);

const typeForSlug = (slug: string, i: number): string => {
  const rule = TYPE_RULES.find(([key]) => slug.includes(key));
  return rule ? rule[1] : ALL_TYPES[(hash(slug) + i) % ALL_TYPES.length];
};

const priceRangeForSlug = (slug: string): [number, number] => {
  if (slug.includes('under-500')) return [180, 499];
  if (slug.includes('500-1000')) return [500, 1000];
  if (slug.includes('1000-2500')) return [1000, 2500];
  if (slug.includes('over-2500')) return [2500, 9800];
  if (slug.includes('engagement')) return [1800, 8900];
  if (slug.includes('silver')) return [150, 650];
  return [350, 4200];
};

const BADGES: (string | null)[] = [null, 'New', null, 'Best Seller', null, null, null, null];

export const getProductsForSlug = (slug: string, count = 16): Product[] => {
  const seed = hash(slug);
  const [min, max] = priceRangeForSlug(slug);
  return Array.from({ length: count }, (_, i) => {
    const metal = METALS[(seed + i * 3) % METALS.length];
    const style = STYLES[(seed + i * 5) % STYLES.length];
    const type = typeForSlug(slug, i);
    const price = Math.round((min + (((seed >> 3) + i * 977) % (max - min))) / 10) * 10 - 1;
    return {
      id: `${slug}--${i}`,
      sku: `KL${String((seed + i * 131) % 99999).padStart(5, '0')}`,
      name: `${style} ${metal.name} ${type}`,
      type,
      metal: metal.name,
      tone: metal.tone,
      price,
      badge: BADGES[(seed + i) % BADGES.length],
      rating: 4 + (((seed + i) % 10) / 10),
      reviews: 8 + ((seed + i * 7) % 140),
      collection: slug,
    };
  });
};

export const getProductById = (id: string): Product | null => {
  const [slug, index] = id.split('--');
  const product = getProductsForSlug(slug)[Number(index)];
  return product || null;
};