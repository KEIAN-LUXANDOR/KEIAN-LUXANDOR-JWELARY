'use client';

import useFetch from '@/hooks/useFetch';
import { getProduct } from '../services/productService';

/** Loads one product by its id (from /product/[slug]). `notFound` is true for unknown ids. */
export default function useProductDetails(id: string) {
  const { data, loading, error } = useFetch(() => getProduct(id), id);
  const notFound = !loading && ((error && error.message === 'not-found') || (!error && !data));
  return { product: data, loading, error: notFound ? null : error, notFound: Boolean(notFound) };
}
