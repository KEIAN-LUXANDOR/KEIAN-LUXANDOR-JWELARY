import type { Metadata } from 'next';
import CollectionPage from '@/features/categories/components/CollectionPage';
import { metalCategoryQuery } from '@/features/categories/services/categoryService';
import { METAL_CATEGORIES } from '@/features/categories/utils/categoryConfig';

const category = METAL_CATEGORIES.white;

export const metadata: Metadata = { title: category.title, description: category.description };

// Address: /diamond-white
export default function Page() {
  return (
    <CollectionPage
      title={category.title}
      description={category.description}
      crumbs={[{ label: 'Jewelry', to: '/collections/fine-jewelry' }, { label: category.title }]}
      query={metalCategoryQuery(category.id)}
      metal={category.id}
    />
  );
}
