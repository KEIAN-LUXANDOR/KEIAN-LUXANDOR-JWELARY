// ─────────────────────────────────────────────────────────────
// Products from the Spring Boot backend.
//   GET /api/products            → every product
//   GET /api/products?tag=rings  → products in "rings" (category or tag)
//   GET /api/products/{id}       → one product
// ─────────────────────────────────────────────────────────────
import { apiGet } from '@/services/apiClient';
import type { ApiProduct, Product, ProductQuery } from '../types/productTypes';
import { getProductById, getProductsForSlug } from './mockCatalog';
import { matchesQuery, toneForMetal } from '../utils/productHelpers';

// Converts a product from the backend into the shape the website uses.
const normalize = (p: ApiProduct): Product => ({
  id: String(p.id),
  sku: p.sku || '',
  name: p.name,
  type: p.type || '',
  metal: p.metal || '',
  price: Number(p.price) || 0,
  badge: p.badge || null,
  rating: p.rating ?? 5,
  reviews: p.reviews ?? 0,
  description: p.description || '',
  tone: p.tone || toneForMetal(p.metal || ''),
  images: p.images || [],
  image: p.images?.[0] || '',
  collection: p.category || 'fine-jewelry',
  diamondShape: p.diamondShape || undefined,
  caratWeight: p.caratWeight != null ? Number(p.caratWeight) : undefined,
  diamondColor: p.diamondColor || undefined,
  diamondClarity: p.diamondClarity || undefined,
});

/** All products, or the ones with a tag such as 'rings' or 'new-arrivals', optionally filtered by metal. */
export async function getProducts({ tag, metals }: ProductQuery = {}): Promise<Product[]> {
  const query = tag ? `?tag=${encodeURIComponent(tag)}` : '';
  const list = (await apiGet<ApiProduct[]>(`/products${query}`)).map(normalize);
  return metals?.length ? list.filter((p) => metals.includes(p.metal)) : list;
}

/** One product by its id (1, 2, 3 …). Demo ids like "rings--0" come from the search box. */
export async function getProduct(id: string): Promise<Product | null> {
  if (id.includes('--')) return getProductById(id);
  return normalize(await apiGet<ApiProduct>(`/products/${encodeURIComponent(id)}`));
}

/** Other pieces from the same collection ("You May Also Like"). */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (product.id.includes('--')) return [];
  const items = await getProducts({ tag: product.collection });
  return items.filter((p) => p.id !== product.id).slice(0, limit);
}

// ── Search box (demo catalogue until the backend has a search endpoint) ──
const SEARCH_SLUGS = ['rings', 'earrings', 'bracelets', 'necklaces', 'pendants', 'engagement-rings', 'wedding-rings', 'mens-jewelry', 'signature', 'sterling-silver'];
let searchIndex: Product[] | undefined;

export function searchProducts(text: string, limit = 24): Product[] {
  const q = text.trim().toLowerCase();
  if (!q) return [];
  searchIndex ??= SEARCH_SLUGS.flatMap((s) => getProductsForSlug(s, 12));
  return searchIndex.filter((p) => matchesQuery(`${p.name} ${p.type} ${p.metal}`, q)).slice(0, limit);
}
