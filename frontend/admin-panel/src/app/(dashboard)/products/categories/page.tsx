import type { Metadata } from 'next';
import CategoryManager from '@/features/categories/components/CategoryManager';

export const metadata: Metadata = { title: 'Categories' };

// Address: /products/categories
export default function Page() {
  return <CategoryManager />;
}
