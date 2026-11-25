import type { Tone } from '@/types/common';

/** The four metal categories, each with its own page (/diamond-gold, /diamond-silver, …). */
export type MetalCategoryId = 'gold' | 'silver' | 'rose' | 'white';

export interface MetalCategory {
  id: MetalCategoryId;
  slug: string; // route: /diamond-gold
  title: string;
  description: string;
  /** Product metal names that belong in this category. */
  metals: string[];
  tone: Tone;
}

/** The five jewellery types, each with its own page (/rings, /earrings, …). */
export type JewelleryTypeId = 'rings' | 'earrings' | 'necklaces' | 'bracelets' | 'pendants';

export interface JewelleryType {
  id: JewelleryTypeId;
  slug: string; // route: /rings
  title: string;
  description: string;
  image?: string;
  tone: Tone;
}
