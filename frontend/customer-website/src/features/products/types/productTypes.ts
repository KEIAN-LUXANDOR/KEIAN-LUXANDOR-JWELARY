import type { Tone } from '@/types/common';

/**
 * One piece of jewellery, as the website uses it.
 * The same shape serves gold, silver, rose gold and white gold rings,
 * necklaces, pendants… — one common product system for every category.
 */
export interface Product {
  id: string;
  sku?: string;
  name: string;
  type: string; // "Ring", "Stud Earrings", …
  metal: string; // "14K Yellow Gold", "Sterling Silver", …
  price: number;
  badge: string | null;
  rating: number;
  reviews: number;
  description?: string;
  tone: Tone; // placeholder colour when there is no photo yet
  images?: string[];
  image?: string; // first photo
  collection: string; // main collection, e.g. "rings"
  // Optional specifications — shown on the product page when the backend sends them.
  diamondShape?: string;
  caratWeight?: number;
  diamondColor?: string;
  diamondClarity?: string;
}

/** A product as the Spring Boot backend sends it (GET /api/products). */
export interface ApiProduct {
  id: number | string;
  sku?: string | null;
  name: string;
  type?: string | null;
  metal?: string | null;
  price: number | string;
  badge?: string | null;
  rating?: number | null;
  reviews?: number | null;
  description?: string | null;
  tone?: Tone | null;
  images?: string[] | null;
  category?: string | null;
  diamondShape?: string | null;
  caratWeight?: number | string | null;
  diamondColor?: string | null;
  diamondClarity?: string | null;
}

/** Which products a page wants. */
export interface ProductQuery {
  /** Collection or tag, e.g. "rings", "gifts", "new-arrivals". Empty = every product. */
  tag?: string;
  /** Keep only these metals, e.g. ["14K Yellow Gold"] for /diamond-gold. */
  metals?: string[];
}

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

export interface PriceBand {
  id: string;
  label: string;
  test: (price: number) => boolean;
}
