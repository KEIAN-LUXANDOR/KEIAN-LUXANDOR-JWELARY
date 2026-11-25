'use client';

import { useMemo } from 'react';
import { searchProducts } from '@/features/products/services/productService';
import { searchCollections } from '../utils/searchHelpers';

/** Live search results while the customer types. */
export default function useSearch(query: string, productLimit = 4, collectionLimit = 6) {
  const products = useMemo(() => searchProducts(query, productLimit), [query, productLimit]);
  const collections = useMemo(() => searchCollections(query, collectionLimit), [query, collectionLimit]);
  return { products, collections };
}
