import type { Metadata } from 'next';
import CollectionPage from '@/features/categories/components/CollectionPage';
import { jewelleryTypeQuery } from '@/features/categories/services/categoryService';
import { JEWELLERY_TYPES } from '@/features/categories/utils/categoryConfig';

const category = JEWELLERY_TYPES.earrings;

export const metadata: Metadata = { title: category.title, description: category.description };

// Address: /earrings  (products from GET /api/products?tag=earrings)
export default function Page() {
  return (
    <CollectionPage
      title={category.title}
      crumbs={[{ label: 'Jewelry', to: '/collections/fine-jewelry' }, { label: category.title }]}
      query={jewelleryTypeQuery(category.id)}
    />
  );
}
