import type { Metadata } from 'next';
import EditProduct from '@/features/products/components/EditProduct';

export const metadata: Metadata = { title: 'Edit product' };

// Address: /products/[id]
export default async function Page({ params }: PageProps<'/products/[id]'>) {
  const { id } = await params;
  return <EditProduct key={id} id={id} />;
}
