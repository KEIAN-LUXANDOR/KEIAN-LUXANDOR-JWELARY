'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/Badge';
import Button, { ButtonLink } from '@/components/buttons/Button';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import useRecord from '@/hooks/useRecord';
import useResource from '@/hooks/useResource';
import { useToast } from '@/lib/providers/ToastProvider';
import { formatDateTime } from '@/utils/format';
import { productService } from '../services/productService';
import { toInput } from '../utils/productUtils';
import ProductForm from './ProductForm';

/** /products/[id] — edit or delete one product. */
export default function EditProduct({ id }: { id: string }) {
  const router = useRouter();
  const toast = useToast();
  const { record: product, loading, found, error, setRecord } = useRecord(productService, id);
  const { items } = useResource(productService);
  const [confirm, setConfirm] = useState(false);

  if (loading) return <Loading />;
  if (!found || !product)
    return <EmptyState icon="alert" title={error ? 'Could not load this product' : 'Product not found'} text={error ?? undefined} action={<ButtonLink href="/products">Back to products</ButtonLink>} />;

  return (
    <>
      <PageHeader
        title={product.name}
        description={`Style #${product.sku} · last saved ${formatDateTime(product.updatedAt)}`}
        back={{ href: '/products', label: 'Products' }}
        actions={<StatusBadge status={product.status} />}
      />
      <ProductForm
        key={product.updatedAt}
        initial={toInput(product)}
        existingSkus={items.filter((p) => p.id !== product.id).map((p) => p.sku)}
        submitLabel="Save changes"
        onCancel={() => router.push('/products')}
        onSubmit={async (values) => {
          const saved = await productService.update(product.id, { ...values, updatedAt: new Date().toISOString() });
          setRecord(saved);
          toast('Changes saved');
        }}
        extraActions={
          <Button variant="ghost" icon="trash" onClick={() => setConfirm(true)}>
            Delete
          </Button>
        }
      />
      <ConfirmDialog
        open={confirm}
        title="Delete product?"
        message={`“${product.name}” will be removed from the store. This can’t be undone.`}
        onClose={() => setConfirm(false)}
        onConfirm={async () => {
          await productService.remove(product.id);
          toast('Product deleted');
          router.push('/products');
        }}
      />
    </>
  );
}
