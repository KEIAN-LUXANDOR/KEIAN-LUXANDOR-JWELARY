import type { Metadata } from 'next';
import CollectionPage from '@/features/categories/components/CollectionPage';
import { jewelleryTypeQuery } from '@/features/categories/services/categoryService';
import { JEWELLERY_TYPES } from '@/features/categories/utils/categoryConfig';

const category = JEWELLERY_TYPES.rings;

export const metadata: Metadata = { title: category.title, description: category.description };

// Address: /rings  (products from GET /api/products?tag=rings)
export default function Page() {
  return (
    <CollectionPage
      title={category.title}
      crumbs={[{ label: 'Jewelry', to: '/collections/fine-jewelry' }, { label: category.title }]}
      query={jewelleryTypeQuery(category.id)}
    />
  );
}
