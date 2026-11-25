import Link from 'next/link';
import { METAL_CATEGORIES } from '../utils/categoryConfig';
import type { MetalCategoryId } from '../types/categoryTypes';

const SWATCH: Record<MetalCategoryId, string> = { gold: '#d9b45a', silver: '#c9ccd1', rose: '#e2a98f', white: '#e4e4e4' };

/** Links between the four metal pages. */
export default function MetalCategoryNav({ active }: { active?: MetalCategoryId }) {
  return (
    <nav className="metal-nav container" aria-label="Shop by metal">
      {Object.values(METAL_CATEGORIES).map((m) => (
        <Link key={m.id} href={`/${m.slug}`} className={`metal-nav__link ${active === m.id ? 'is-active' : ''}`} aria-current={active === m.id ? 'page' : undefined}>
          <span className="metal-nav__swatch" style={{ background: SWATCH[m.id] }} aria-hidden="true" />
          {m.label}
        </Link>
      ))}
    </nav>
  );
}
