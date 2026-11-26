'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/Badge';
import Button from '@/components/buttons/Button';
import DataTable, { type Column } from '@/components/tables/DataTable';
import TableToolbar from '@/components/tables/TableToolbar';
import SearchInput from '@/components/forms/SearchInput';
import FilterSelect from '@/components/forms/FilterSelect';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import useResource from '@/hooks/useResource';
import { useToast } from '@/lib/providers/ToastProvider';
import { PAYMENT_STATUSES } from '@/lib/constants';
import type { Payment } from '@/types/models';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { matchesSearch } from '@/utils/text';
import { paymentService, refundPayment } from '../services/paymentService';

/** /payments */
export default function PaymentList() {
  const { items, loading, error, setItems } = useResource(paymentService);
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [toRefund, setToRefund] = useState<Payment | null>(null);

  const rows = useMemo(
    () => items.filter((p) => (!query || matchesSearch(`${p.orderNumber} ${p.customerName} ${p.reference}`, query)) && (!status || p.status === status) && (!method || p.method === method)),
    [items, query, status, method],
  );
  const sum = (s: Payment['status']) => items.filter((p) => p.status === s).reduce((t, p) => t + p.amount, 0);

  const columns: Column<Payment>[] = [
    { key: 'createdAt', header: 'Date', sortValue: (p) => p.createdAt, render: (p) => formatDateTime(p.createdAt) },
    {
      key: 'order',
      header: 'Order',
      sortValue: (p) => p.orderNumber,
      render: (p) => (
        <div>
          <Link href={`/orders/${p.orderId}`} className="cell-title">
            #{p.orderNumber}
          </Link>
          <div className="cell-sub">{p.customerName}</div>
        </div>
      ),
    },
    {
      key: 'method',
      header: 'Method',
      sortValue: (p) => p.method,
      render: (p) => (
        <div>
          <div>{p.method}</div>
          <div className="cell-sub">
            {p.provider} · {p.reference}
          </div>
        </div>
      ),
    },
    { key: 'amount', header: 'Amount', align: 'right', sortValue: (p) => p.amount, render: (p) => <span className="num">{formatCurrency(p.amount)}</span> },
    { key: 'status', header: 'Status', sortValue: (p) => p.status, render: (p) => <StatusBadge status={p.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (p) =>
        p.status === 'Captured' ? (
          <Button size="sm" variant="secondary" onClick={() => setToRefund(p)}>
            Refund
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader title="Payments" description="Card details are held by the payment providers (Stripe, PayPal), never by Keian." />
      <div className="grid-stats">
        <StatCard label="Received" value={formatCurrency(sum('Captured'))} icon="card" />
        <StatCard label="Waiting" value={formatCurrency(sum('Pending'))} icon="refresh" hint="bank transfers not yet received" />
        <StatCard label="Refunded" value={formatCurrency(sum('Refunded'))} icon="arrowDown" />
        <StatCard label="Failed" value={String(items.filter((p) => p.status === 'Failed').length)} icon="alert" hint="payments that didn’t go through" />
      </div>
      <TableToolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Order #, name or reference" label="Search payments" />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={[{ value: '', label: 'All statuses' }, ...PAYMENT_STATUSES.map((s) => ({ value: s, label: s }))]} />
        <FilterSelect label="Method" value={method} onChange={setMethod} options={[{ value: '', label: 'All methods' }, ...['Card', 'PayPal', 'Bank Transfer'].map((m) => ({ value: m, label: m }))]} />
      </TableToolbar>
      <DataTable caption="Payments" columns={columns} rows={rows} rowKey={(p) => p.id} loading={loading} error={error} initialSort={{ key: 'createdAt', dir: 'desc' }} />
      <ConfirmDialog
        open={toRefund !== null}
        title="Refund payment?"
        message={`Refund ${toRefund ? formatCurrency(toRefund.amount) : ''} to ${toRefund?.customerName} for order #${toRefund?.orderNumber}. The order will be marked as refunded.`}
        confirmLabel="Refund"
        onClose={() => setToRefund(null)}
        onConfirm={async () => {
          if (!toRefund) return;
          const updated = await refundPayment(toRefund);
          setItems((list) => list.map((p) => (p.id === updated.id ? updated : p)));
          toast('Payment refunded');
        }}
      />
    </>
  );
}
