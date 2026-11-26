'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { ButtonLink } from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import DataTable, { type Column } from '@/components/tables/DataTable';
import TableToolbar from '@/components/tables/TableToolbar';
import SearchInput from '@/components/forms/SearchInput';
import FilterSelect from '@/components/forms/FilterSelect';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import { StatusBadge } from '@/components/common/Badge';
import MetalSwatch from '@/components/common/MetalSwatch';
import ProductThumb from '@/components/common/ProductThumb';
import useResource from '@/hooks/useResource';
import { useToast } from '@/lib/providers/ToastProvider';
import { METALS, PRODUCT_STATUSES } from '@/lib/constants';
import { categoryService } from '@/features/categories/services/categoryService';
import type { Product } from '@/types/models';
import { formatCurrency } from '@/utils/format';
import { downloadCsv } from '@/utils/csv';
import { matchesSearch } from '@/utils/text';
import { productService } from '../services/productService';
import { stockStatus } from '../utils/productUtils';

/** /products — every product with search, filters and delete. */
export default function ProductList() {
  const { items, loading, error, remove } = useResource(productService);
  const { items: categories } = useResource(categoryService);
  const toast = useToast();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [metal, setMetal] = useState('');
  const [status, setStatus] = useState('');
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const categoryName = useMemo(() => Object.fromEntries(categories.map((c) => [c.slug, c.name])), [categories]);

  const rows = useMemo(
    () =>
      items.filter(
        (p) =>
          (!query || matchesSearch(`${p.name} ${p.sku} ${p.type}`, query)) &&
          (!category || p.category === category) &&
          (!metal || p.metal === metal) &&
          (!status || p.status === status),
      ),
    [items, query, category, metal, status],
  );

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      sortValue: (p) => p.name,
      render: (p) => (
        <div className="cell-main">
          <ProductThumb src={p.images[0]} alt="" />
          <div>
            <Link href={`/products/${p.id}`} className="cell-title">
              {p.name}
            </Link>
            <div className="cell-sub">{p.sku}</div>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', sortValue: (p) => categoryName[p.category] ?? p.category, render: (p) => categoryName[p.category] ?? p.category },
    { key: 'metal', header: 'Metal', sortValue: (p) => p.metal, render: (p) => <MetalSwatch metal={p.metal} /> },
    { key: 'price', header: 'Price', align: 'right', sortValue: (p) => p.price, render: (p) => <span className="num">{formatCurrency(p.price)}</span> },
    {
      key: 'stock',
      header: 'Stock',
      align: 'right',
      sortValue: (p) => p.stock,
      render: (p) => (
        <span className="num" title={stockStatus(p)}>
          {p.stock} {stockStatus(p) !== 'In stock' && <StatusBadge status={stockStatus(p)} />}
        </span>
      ),
    },
    { key: 'status', header: 'Status', sortValue: (p) => p.status, render: (p) => <StatusBadge status={p.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (p) => (
        <span className="row-actions">
          <IconButton icon="edit" label={`Edit ${p.name}`} onClick={() => router.push(`/products/${p.id}`)} />
          <IconButton icon="trash" label={`Delete ${p.name}`} tone="danger" onClick={() => setToDelete(p)} />
        </span>
      ),
    },
  ];

  const exportCsv = () =>
    downloadCsv(
      'products.csv',
      ['SKU', 'Name', 'Type', 'Category', 'Metal', 'Price', 'Stock', 'Status'],
      rows.map((p) => [p.sku, p.name, p.type, categoryName[p.category] ?? p.category, p.metal, p.price, p.stock, p.status]),
    );

  return (
    <>
      <PageHeader
        title="Products"
        description={`${items.length} products in four metals`}
        actions={
          <>
            <button type="button" className="btn btn--secondary" onClick={exportCsv} disabled={!rows.length}>
              Export CSV
            </button>
            <ButtonLink href="/products/add" icon="plus">
              Add product
            </ButtonLink>
          </>
        }
      />
      <TableToolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search name or SKU" label="Search products" />
        <FilterSelect label="Category" value={category} onChange={setCategory} options={[{ value: '', label: 'All categories' }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]} />
        <FilterSelect label="Metal" value={metal} onChange={setMetal} options={[{ value: '', label: 'All metals' }, ...METALS.map((m) => ({ value: m.value, label: m.label }))]} />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={[{ value: '', label: 'All statuses' }, ...PRODUCT_STATUSES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))]} />
      </TableToolbar>
      <DataTable
        caption="Products"
        columns={columns}
        rows={rows}
        rowKey={(p) => p.id}
        loading={loading}
        error={error}
        emptyTitle={items.length ? 'No products match these filters' : 'No products yet'}
        onRowClick={(p) => router.push(`/products/${p.id}`)}
      />
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete product?"
        message={`“${toDelete?.name}” will be removed from the store. This can’t be undone.`}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return;
          await remove(toDelete.id);
          toast('Product deleted');
        }}
      />
    </>
  );
}
