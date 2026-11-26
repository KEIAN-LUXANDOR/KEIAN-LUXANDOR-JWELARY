'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/Badge';
import MetalSwatch from '@/components/common/MetalSwatch';
import ProductThumb from '@/components/common/ProductThumb';
import IconButton from '@/components/buttons/IconButton';
import DataTable, { type Column } from '@/components/tables/DataTable';
import TableToolbar from '@/components/tables/TableToolbar';
import SearchInput from '@/components/forms/SearchInput';
import FilterSelect from '@/components/forms/FilterSelect';
import useResource from '@/hooks/useResource';
import { useToast } from '@/lib/providers/ToastProvider';
import { productService } from '@/features/products/services/productService';
import { stockStatus } from '@/features/products/utils/productUtils';
import type { Product } from '@/types/models';
import { formatCurrency, formatNumber } from '@/utils/format';
import { matchesSearch } from '@/utils/text';

/** Stock number you can type in; saves when you leave the box or press Enter. */
function StockInput({ product, onSave }: { product: Product; onSave: (stock: number) => void }) {
  const [draft, setDraft] = useState(String(product.stock));
  const commit = () => {
    const n = Math.max(0, Math.floor(Number(draft)));
    if (Number.isFinite(n) && n !== product.stock) onSave(n);
    else setDraft(String(product.stock));
  };
  return (
    <input
      className="inline-input num"
      type="number"
      min={0}
      value={draft}
      aria-label={`Stock for ${product.name}`}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
    />
  );
}

/** /inventory — stock levels for every product. */
export default function InventoryManager() {
  const { items, loading, error, update } = useResource(productService);
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');

  const setStock = async (p: Product, stock: number) => {
    await update(p.id, { stock, updatedAt: new Date().toISOString() });
    toast(`${p.sku}: stock is now ${stock}`);
  };

  const summary = useMemo(
    () => ({
      units: items.reduce((s, p) => s + p.stock, 0),
      value: items.reduce((s, p) => s + p.stock * p.price, 0),
      low: items.filter((p) => stockStatus(p) === 'Low stock').length,
      out: items.filter((p) => stockStatus(p) === 'Out of stock').length,
    }),
    [items],
  );

  const rows = useMemo(
    () => items.filter((p) => (!query || matchesSearch(`${p.name} ${p.sku}`, query)) && (!filter || stockStatus(p) === filter)),
    [items, query, filter],
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
    { key: 'metal', header: 'Metal', sortValue: (p) => p.metal, render: (p) => <MetalSwatch metal={p.metal} /> },
    { key: 'status', header: 'Stock status', sortValue: (p) => p.stock, render: (p) => <StatusBadge status={stockStatus(p)} /> },
    { key: 'threshold', header: 'Alert at', align: 'right', render: (p) => <span className="num muted">{p.lowStockThreshold}</span> },
    {
      key: 'stock',
      header: 'In stock',
      align: 'right',
      sortValue: (p) => p.stock,
      render: (p) => (
        <span className="row-actions" style={{ alignItems: 'center' }}>
          <IconButton icon="minus" label={`One less ${p.name}`} disabled={p.stock <= 0} onClick={() => setStock(p, p.stock - 1)} />
          <StockInput key={p.stock} product={p} onSave={(n) => setStock(p, n)} />
          <IconButton icon="plus" label={`One more ${p.name}`} onClick={() => setStock(p, p.stock + 1)} />
        </span>
      ),
    },
    { key: 'value', header: 'Stock value', align: 'right', sortValue: (p) => p.stock * p.price, render: (p) => <span className="num">{formatCurrency(p.stock * p.price)}</span> },
  ];

  return (
    <>
      <PageHeader title="Inventory" description="Change stock with − / + or type a number. Changes save straight away." />
      <div className="grid-stats">
        <StatCard label="Units in stock" value={formatNumber(summary.units)} icon="layers" />
        <StatCard label="Stock value (retail)" value={formatCurrency(summary.value)} icon="dollar" />
        <StatCard label="Low stock" value={String(summary.low)} icon="alert" hint="at or below their alert level" />
        <StatCard label="Out of stock" value={String(summary.out)} icon="box" hint="can’t be bought right now" />
      </div>
      <TableToolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search name or SKU" label="Search inventory" />
        <FilterSelect
          label="Stock status"
          value={filter}
          onChange={setFilter}
          options={[
            { value: '', label: 'All stock levels' },
            { value: 'Low stock', label: 'Low stock' },
            { value: 'Out of stock', label: 'Out of stock' },
            { value: 'In stock', label: 'In stock' },
          ]}
        />
      </TableToolbar>
      <DataTable caption="Inventory" columns={columns} rows={rows} rowKey={(p) => p.id} loading={loading} error={error} initialSort={{ key: 'stock', dir: 'asc' }} pageSize={20} />
    </>
  );
}
