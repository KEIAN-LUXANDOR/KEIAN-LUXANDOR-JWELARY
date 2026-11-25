import ProductDetails from '@/features/products/components/ProductDetails';

// Address: /product/1, /product/2 … (the product id from the backend)
export default async function ProductPage({ params }: PageProps<'/product/[slug]'>) {
  const { slug } = await params;
  return <ProductDetails key={slug} id={slug} />;
}
