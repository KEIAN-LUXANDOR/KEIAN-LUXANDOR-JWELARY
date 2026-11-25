import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchResults from '@/features/search/components/SearchResults';

export const metadata: Metadata = { title: 'Search' };

// Address: /search?q=ring
// The search words are read in the browser, so the page waits for them inside <Suspense>.
export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <SearchResults />
    </Suspense>
  );
}
