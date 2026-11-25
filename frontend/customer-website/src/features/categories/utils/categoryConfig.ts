// ─────────────────────────────────────────────────────────────
// Category definitions. One common product system serves every
// category — these only decide which products a page shows.
// ─────────────────────────────────────────────────────────────
import type { JewelleryType, JewelleryTypeId, MetalCategory, MetalCategoryId } from '../types/categoryTypes';

export const METAL_CATEGORIES: Record<MetalCategoryId, MetalCategory> = {
  gold: {
    id: 'gold',
    slug: 'diamond-gold',
    title: 'Diamond Yellow Gold Jewelry',
    label: 'Yellow Gold',
    description: 'Warm 14K yellow gold set with diamonds.',
    metals: ['14K Yellow Gold'],
    tone: 'gold',
  },
  rose: {
    id: 'rose',
    slug: 'diamond-rose',
    title: 'Diamond Rose Gold Jewelry',
    label: 'Rose Gold',
    description: 'Romantic 14K rose gold, finished by hand.',
    metals: ['14K Rose Gold'],
    tone: 'rose',
  },
  white: {
    id: 'white',
    slug: 'diamond-white',
    title: 'Diamond White Gold Jewelry',
    label: 'White Gold',
    description: 'Bright 14K white gold that lets every diamond shine.',
    metals: ['14K White Gold'],
    tone: 'silver',
  },
  silver: {
    id: 'silver',
    slug: 'diamond-silver',
    title: 'Diamond Silver 925 Jewelry',
    label: 'Silver 925',
    description: '925 sterling silver pieces with a soft, everyday shine.',
    metals: ['Sterling Silver'],
    tone: 'silver',
  },
};

export const JEWELLERY_TYPES: Record<JewelleryTypeId, JewelleryType> = {
  rings: { id: 'rings', slug: 'rings', title: 'Rings', description: 'Statement, stackable and promise rings in every metal.', image: '/images/ring.webp', tone: 'rose' },
  earrings: { id: 'earrings', slug: 'earrings', title: 'Earrings', description: 'Studs, hoops and drops to wear every day.', image: '/images/earring.webp', tone: 'gold' },
  necklaces: { id: 'necklaces', slug: 'necklaces', title: 'Necklaces', description: 'Chains, tennis necklaces and layered looks.', image: '/images/necklace.webp', tone: 'cream' },
  bracelets: { id: 'bracelets', slug: 'bracelets', title: 'Bracelets', description: 'Tennis, bangle and beaded bracelets.', image: '/images/bracelet.webp', tone: 'silver' },
  pendants: { id: 'pendants', slug: 'pendants', title: 'Pendants', description: 'Diamond pendants and medallions.', image: '/images/pendant.webp', tone: 'gold' },
};

/** Old collection slugs that now have their own top-level page. */
const DEDICATED_PAGES: Record<string, string> = {
  rings: '/rings',
  earrings: '/earrings',
  necklaces: '/necklaces',
  bracelets: '/bracelets',
  pendants: '/pendants',
  'yellow-gold': '/diamond-gold',
  'sterling-silver': '/diamond-silver',
  'rose-gold': '/diamond-rose',
  'white-gold': '/diamond-white',
};

/** URL for a collection slug: a dedicated page when one exists, otherwise /collections/[slug]. */
export const collectionHref = (slug: string): string => DEDICATED_PAGES[slug] ?? `/collections/${slug}`;

/** Reverse of collectionHref: "/rings" → "rings", "/collections/foo" → "foo". */
export const slugFromHref = (href: string): string | null => {
  const match = Object.entries(DEDICATED_PAGES).find(([, path]) => path === href);
  if (match) return match[0];
  return href.startsWith('/collections/') ? href.slice('/collections/'.length) : null;
};
