import type { Metadata } from 'next';
import AddProduct from '@/features/products/components/AddProduct';

export const metadata: Metadata = { title: 'Add product' };

// Address: /products/add
export default function Page() {
  return <AddProduct />;
}
