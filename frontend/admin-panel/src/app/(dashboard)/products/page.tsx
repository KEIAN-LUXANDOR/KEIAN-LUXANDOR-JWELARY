import type { Metadata } from 'next';
import ProductList from '@/features/products/components/ProductList';

export const metadata: Metadata = { title: 'Products' };

// Address: /products
export default function Page() {
  return <ProductList />;
}
