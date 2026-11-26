'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/Badge';
import Stars from '@/components/common/Stars';
import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import DataTable, { type Column } from '@/components/tables/DataTable';
import TableToolbar from '@/components/tables/TableToolbar';
import SearchInput from '@/components/forms/SearchInput';
import FilterSelect from '@/components/forms/FilterSelect';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import useResource from '@/hooks/useResource';
import { useToast } from '@/lib/providers/ToastProvider';
import { REVIEW_STATUSES } from '@/lib/constants';
import type { Review, ReviewStatus } from '@/types/models';
import { formatDate } from '@/utils/format';
import { matchesSearch } from '@/utils/text';
import { reviewService } from '../services/reviewService';

/** /reviews — approve, hide or delete customer reviews. Only approved reviews show on the website. */
export default function ReviewManager() {
  const { items, loading, error, update, remove } = useResource(reviewService);
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('pending');
  const [rating, setRating] = useState('');
  const [toDelete, setToDelete] = useState<Review | null>(null);

  const pending = items.filter((r) => r.status === 'pending').length;
  const average = items.length ? items.filter((r) => r.status === 'approved').reduce((s, r, _, a) => s + r.rating / a.length, 0) : 0;

  const rows = useMemo(
    () => items.filter((r) => (!query || matchesSearch(`${r.productName} ${r.customerName} ${r.title} ${r.body}`, query)) && (!status || r.status === status) && (!rating || r.rating === Number(rating))),
    [items, query, status, rating],
  );

  const setReviewStatus = async (r: Review, s: ReviewStatus) => {
    await update(r.id, { status: s });
    toast(s === 'approved' ? 'Review approved — it now shows on the website' : 'Review hidden');
  };

  const columns: Column<Review>[] = [
    { key: 'rating', header: 'Rating', sortValue: (r) => r.rating, render: (r) => <Stars rating={r.rating} /> },
    {
      key: 'review',
      header: 'Review',
      render: (r) => (
        <div className="wrap" style={{ maxWidth: 460 }}>
          <div className="cell-title">{r.title}</div>
          <div>{r.body}</div>
          <div className="cell-sub">
            {r.customerName} on{' '}
            <Link href={`/products/${r.productId}`} className="link">
              {r.productName}
            </Link>
          </div>
        </div>
      ),
    },
    { key: 'createdAt', header: 'Date', sortValue: (r) => r.createdAt, render: (r) => formatDate(r.createdAt) },
    { key: 'status', header: 'Status', sortValue: (r) => r.status, render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => (
        <span className="row-actions" style={{ alignItems: 'center', gap: 6 }}>
          {r.status !== 'approved' && (
            <Button size="sm" variant="secondary" icon="check" onClick={() => setReviewStatus(r, 'approved')}>
              Approve
            </Button>
          )}
          {r.status !== 'hidden' && (
            <Button size="sm" variant="ghost" icon="eyeOff" onClick={() => setReviewStatus(r, 'hidden')}>
              Hide
            </Button>
          )}
          <IconButton icon="trash" label="Delete review" tone="danger" onClick={() => setToDelete(r)} />
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Reviews" description={`${pending} waiting for approval · average approved rating ${average.toFixed(1)} ★`} />
      <TableToolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Product, customer or words" label="Search reviews" />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={[{ value: '', label: 'All reviews' }, ...REVIEW_STATUSES.map((s) => ({ value: s, label: s === 'pending' ? `Waiting (${pending})` : s.charAt(0).toUpperCase() + s.slice(1) }))]} />
        <FilterSelect label="Rating" value={rating} onChange={setRating} options={[{ value: '', label: 'All ratings' }, ...[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} stars` }))]} />
      </TableToolbar>
      <DataTable caption="Reviews" columns={columns} rows={rows} rowKey={(r) => r.id} loading={loading} error={error} emptyTitle={status === 'pending' ? 'No reviews waiting — all caught up' : 'No reviews match'} initialSort={{ key: 'createdAt', dir: 'desc' }} />
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete review?"
        message="The review will be removed permanently. To keep it but stop showing it, use Hide instead."
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return;
          await remove(toDelete.id);
          toast('Review deleted');
        }}
      />
    </>
  );
}
