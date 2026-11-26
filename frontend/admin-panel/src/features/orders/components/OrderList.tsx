'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/Badge';
import DataTable, { type Column } from '@/components/tables/DataTable';
import TableToolbar from '@/components/tables/TableToolbar';
import SearchInput from '@/components/forms/SearchInput';
import FilterSelect from '@/components/forms/FilterSelect';
import Button from '@/components/buttons/Button';
import useResource from '@/hooks/useResource';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/constants';
import type { Order } from '@/types/models';
import { downloadCsv } from '@/utils/csv';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';
import { matchesSearch } from '@/utils/text';
import { orderService } from '../services/orderService';
import { itemCount } from '../utils/orderUtils';

/** /orders */
export default function OrderList() {
  const { items, loading, error } = useResource(orderService);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [payment, setPayment] = useState('');

  const rows = useMemo(
    () => items.filter((o) => (!query || matchesSearch(`${o.number} ${o.customerName} ${o.email}`, query)) && (!status || o.status === status) && (!payment || o.paymentStatus === payment)),
    [items, query, status, payment],
  );

  const counts = useMemo(() => Object.fromEntries(ORDER_STATUSES.map((s) => [s, items.filter((o) => o.status === s).length])), [items]);

  const columns: Column<Order>[] = [
    {
      key: 'number',
      header: 'Order',
      sortValue: (o) => o.number,
      render: (o) => (
        <Link href={`/orders/${o.id}`} className="cell-title">
          #{o.number}
        </Link>
      ),
    },
    { key: 'createdAt', header: 'Date', sortValue: (o) => o.createdAt, render: (o) => <span title={formatDateTime(o.createdAt)}>{formatDate(o.createdAt)}</span> },
    {
      key: 'customer',
      header: 'Customer',
      sortValue: (o) => o.customerName,
      render: (o) => (
        <div>
          <div>{o.customerName}</div>
          <div className="cell-sub">{o.email}</div>
        </div>
      ),
    },
    { key: 'items', header: 'Items', align: 'right', render: (o) => <span className="num">{itemCount(o.items)}</span> },
    { key: 'total', header: 'Total', align: 'right', sortValue: (o) => o.total, render: (o) => <span className="num">{formatCurrency(o.total)}</span> },
    { key: 'payment', header: 'Payment', sortValue: (o) => o.paymentStatus, render: (o) => <StatusBadge status={o.paymentStatus} /> },
    { key: 'status', header: 'Status', sortValue: (o) => o.status, render: (o) => <StatusBadge status={o.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        description={`${counts.Pending ?? 0} pending · ${counts.Processing ?? 0} processing · ${counts.Shipped ?? 0} shipped`}
        actions={
          <Button
            variant="secondary"
            icon="download"
            disabled={!rows.length}
            onClick={() =>
              downloadCsv(
                'orders.csv',
                ['Order', 'Date', 'Customer', 'Email', 'Items', 'Subtotal', 'Discount', 'Tax', 'Total', 'Payment', 'Status'],
                rows.map((o) => [o.number, o.createdAt.slice(0, 10), o.customerName, o.email, itemCount(o.items), o.subtotal, o.discount, o.tax, o.total, o.paymentStatus, o.status]),
              )
            }
          >
            Export CSV
          </Button>
        }
      />
      <TableToolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Order #, name or email" label="Search orders" />
        <FilterSelect label="Order status" value={status} onChange={setStatus} options={[{ value: '', label: 'All statuses' }, ...ORDER_STATUSES.map((s) => ({ value: s, label: `${s} (${counts[s] ?? 0})` }))]} />
        <FilterSelect label="Payment status" value={payment} onChange={setPayment} options={[{ value: '', label: 'All payments' }, ...PAYMENT_STATUSES.map((s) => ({ value: s, label: s }))]} />
      </TableToolbar>
      <DataTable caption="Orders" columns={columns} rows={rows} rowKey={(o) => o.id} loading={loading} error={error} initialSort={{ key: 'createdAt', dir: 'desc' }} onRowClick={(o) => router.push(`/orders/${o.id}`)} />
    </>
  );
}
