import { NAV_MENUS } from '@/lib/data/navigation';
import { titleFromSlug } from '@/utils/text';
import { slugFromHref } from './categoryConfig';

// Collection slug → title, taken from the menu so page titles match the menu labels.
const SLUG_LABELS: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  NAV_MENUS.forEach((menu) => {
    const menuSlug = slugFromHref(menu.to);
    if (menuSlug) map[menuSlug] = menu.label;
    menu.columns.forEach((col) =>
      col.links.forEach((link) => {
        const s = slugFromHref(link.to);
        if (s && !map[s]) map[s] = link.label.replace(/^Shop All\s*/, '') || col.title;
      }),
    );
  });
  return map;
})();

export const getCollectionTitle = (slug: string): string => SLUG_LABELS[slug] || titleFromSlug(slug);
