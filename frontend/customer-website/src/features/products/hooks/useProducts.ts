'use client';

import useFetch from '@/hooks/useFetch';
import type { ProductQuery } from '../types/productTypes';
import { getProducts } from '../services/productService';

/** Loads a product list from the backend. Example: useProducts({ tag: 'rings' }). */
export default function useProducts(query: ProductQuery) {
  const { data, loading, error } = useFetch(() => getProducts(query), JSON.stringify(query));
  return { products: data ?? [], loading, error };
}
