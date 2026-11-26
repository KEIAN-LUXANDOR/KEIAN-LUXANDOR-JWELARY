'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import useResource from '@/hooks/useResource';
import { useToast } from '@/lib/providers/ToastProvider';
import { productService } from '../services/productService';
import { emptyProduct } from '../utils/productUtils';
import ProductForm from './ProductForm';

/** /products/add */
export default function AddProduct() {
  const router = useRouter();
  const toast = useToast();
  const { items, loading, create } = useResource(productService);

  return (
    <>
      <PageHeader title="Add product" back={{ href: '/products', label: 'Products' }} />
      {loading ? (
        <Loading />
      ) : (
        <ProductForm
          initial={emptyProduct()}
          existingSkus={items.map((p) => p.sku)}
          submitLabel="Save product"
          onCancel={() => router.push('/products')}
          onSubmit={async (values) => {
            const now = new Date().toISOString();
            const created = await create({ ...values, createdAt: now, updatedAt: now });
            toast('Product saved');
            router.push(`/products/${created.id}`);
          }}
        />
      )}
    </>
  );
}
