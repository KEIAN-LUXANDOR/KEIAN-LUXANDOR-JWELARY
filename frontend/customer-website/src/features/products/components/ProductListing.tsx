'use client';

import Link from 'next/link';
import { useLayoutEffect, useMemo, useState } from 'react';
import Icon from '@/components/common/Icon';
import SortSelect from '@/components/filters/SortSelect';
import type { Product, SortKey } from '../types/productTypes';
import { applyFilters, metalOptions, SORTS } from '../utils/productHelpers';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';
import './ProductListing.css';

const PAGE_SIZE = 12;
const SORT_OPTIONS = (Object.keys(SORTS) as SortKey[]).map((k) => ({ value: k, label: SORTS[k].label }));

const toggleIn = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

interface ProductListingProps {
  products: Product[];
  loading: boolean;
  error: Error | null;
  /** Hide the metal filter on single-metal pages (e.g. /diamond-gold). */
  showMetalFilter?: boolean;
}

/**
 * Listing page body: filter sidebar, sort, product grid and "Load More".
 * Used by every category page (rings, diamond-gold, collections/…).
 * Give it a `key` per collection so filters reset when the collection changes.
 */
export default function ProductListing({ products, loading, error, showMetalFilter = true }: ProductListingProps) {
  const [metals, setMetals] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('featured');
  const [visible, setVisible] = useState(PAGE_SIZE);
  // Filters start open on large screens. The screen size is only known in the
  // browser, so this is set just before the page is first shown.
  const [filtersOpen, setFiltersOpen] = useState(false);
  useLayoutEffect(() => {
    if (window.innerWidth >= 1024) setFiltersOpen(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const metalList = useMemo(() => metalOptions(products), [products]);
  const results = useMemo(() => applyFilters(products, { metals, prices, sort }), [products, metals, prices, sort]);
  const activeCount = metals.length + prices.length;

  return (
    <div className="container plp">
      <div className="plp__toolbar">
        <button className="plp__filter-btn" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen}>
          <Icon name="menu" size={16} /> Filters {activeCount > 0 && `(${activeCount})`}
        </button>
        <p className="muted plp__count">{loading ? 'Loading…' : `${results.length} items`}</p>
        <SortSelect value={sort} options={SORT_OPTIONS} onChange={setSort} />
      </div>

      <div className={`plp__layout ${filtersOpen ? 'is-filters-open' : ''}`}>
        <ProductFilters
          metalOptions={metalList}
          metals={metals}
          prices={prices}
          showMetal={showMetalFilter}
          onToggleMetal={(m) => setMetals((l) => toggleIn(l, m))}
          onTogglePrice={(b) => setPrices((l) => toggleIn(l, b))}
          onClear={() => {
            setMetals([]);
            setPrices([]);
          }}
        />

        <div>
          {loading && <p className="plp__empty muted">Loading products…</p>}

          {error && (
            <div className="plp__empty">
              <p className="serif">We couldn’t load products.</p>
              <p className="muted">Check that the Spring Boot backend is running on port 8080.</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && (
            <div className="plp__empty">
              <p className="muted">No pieces in this collection yet.</p>
              <Link href="/collections/fine-jewelry" className="link-underline">
                View all jewelry
              </Link>
            </div>
          )}

          {!loading && !error && results.length > 0 && <ProductGrid products={results.slice(0, visible)} />}

          {!loading && visible < results.length && (
            <div className="plp__more">
              <p className="muted">
                Showing {Math.min(visible, results.length)} of {results.length}
              </p>
              <button className="btn btn--outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
