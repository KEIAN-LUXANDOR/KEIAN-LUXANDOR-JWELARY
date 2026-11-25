'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PageHero from '@/components/common/PageHero';
import ProductGrid from '@/features/products/components/ProductGrid';
import useSearch from '../hooks/useSearch';

// The search results, read from ?q= in the address.
export default function SearchResults() {
  const params = useSearchParams();
  const q = params.get('q') || '';
  const { products, collections } = useSearch(q, 48, 8);

  return (
    <>
      <PageHero title={`Results for “${q}”`} text={`${products.length} products found`} crumbs={[{ label: 'Search' }]} />
      <section className="section container">
        {collections.length > 0 && (
          <div className="search-chips">
            {collections.map((c) => (
              <Link key={c.to} href={c.to} className="search-ov__chip">{c.label}</Link>
            ))}
          </div>
        )}
        {products.length === 0 ? (
          <div className="empty-state">
            <p className="serif">Nothing matched your search.</p>
            <Link href="/collections/fine-jewelry" className="btn">Browse All Jewelry</Link>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </>
  );
}