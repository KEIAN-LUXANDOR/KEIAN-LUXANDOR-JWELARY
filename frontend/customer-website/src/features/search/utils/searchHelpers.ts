import { NAV_MENUS } from '@/lib/data/navigation';
import { matchesQuery } from '@/features/products/utils/productHelpers';

export interface CollectionMatch {
  label: string;
  to: string;
  group: string;
}

const COLLECTION_INDEX: CollectionMatch[] = NAV_MENUS.flatMap((m) =>
  m.columns.flatMap((c) => c.links.map((l) => ({ label: l.label, to: l.to, group: m.label }))),
);

/** Menu collections whose name matches the query (e.g. "hoop" → Hoop Earrings). */
export const searchCollections = (query: string, limit = 6): CollectionMatch[] => {
  const q = query.trim();
  if (!q) return [];
  const seen = new Set<string>();
  return COLLECTION_INDEX.filter((c) => {
    if (seen.has(c.to) || !matchesQuery(`${c.label} ${c.group}`, q)) return false;
    seen.add(c.to);
    return true;
  }).slice(0, limit);
};

export const POPULAR_SEARCHES = ['Engagement rings', 'Tennis bracelet', 'Hoop earrings', 'Yellow gold', 'Diamond pendant', 'Wedding band'];

export const searchHref = (query: string) => `/search?q=${encodeURIComponent(query.trim())}`;
