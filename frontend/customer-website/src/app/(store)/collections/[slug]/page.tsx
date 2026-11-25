import type { Metadata } from 'next';
import CollectionPage from '@/features/categories/components/CollectionPage';
import { collectionQuery } from '@/features/categories/services/categoryService';
import { getCollectionTitle } from '@/features/categories/utils/collectionTitle';

export async function generateMetadata({ params }: PageProps<'/collections/[slug]'>): Promise<Metadata> {
  return { title: getCollectionTitle((await params).slug) };
}

// Address: /collections/gifts, /collections/engagement-rings … (menu collections)
// Rings, earrings, necklaces, bracelets, pendants and the four metals have their own folders.
export default async function CollectionRoute({ params }: PageProps<'/collections/[slug]'>) {
  const { slug } = await params;
  const title = getCollectionTitle(slug);
  return <CollectionPage key={slug} title={title} crumbs={[{ label: 'Jewelry', to: '/collections/fine-jewelry' }, { label: title }]} query={collectionQuery(slug)} />;
}
