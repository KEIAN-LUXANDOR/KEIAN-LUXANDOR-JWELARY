'use client';

import PageHero from '@/components/common/PageHero';
import ProductListing from '@/features/products/components/ProductListing';
import useProducts from '@/features/products/hooks/useProducts';
import type { ProductQuery } from '@/features/products/types/productTypes';
import type { Crumb } from '@/types/common';
import type { MetalCategoryId } from '../types/categoryTypes';
import MetalCategoryNav from './MetalCategoryNav';
import './categories.css';

interface CollectionPageProps {
  title: string;
  description?: string;
  crumbs: Crumb[];
  /** Which products to load from the backend. */
  query: ProductQuery;
  /** Set on the four metal pages: shows the metal switcher and hides the metal filter. */
  metal?: MetalCategoryId;
}

/** Shared layout for every listing page: rings, diamond-gold, collections/… */
export default function CollectionPage({ title, description, crumbs, query, metal }: CollectionPageProps) {
  const { products, loading, error } = useProducts(query);
  return (
    <>
      <PageHero title={title} text={description} crumbs={crumbs} />
      {metal && <MetalCategoryNav active={metal} />}
      <ProductListing key={JSON.stringify(query)} products={products} loading={loading} error={error} showMetalFilter={!metal} />
    </>
  );
}
