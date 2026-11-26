'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import StatCard from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/Badge';
import Button, { ButtonLink } from '@/components/buttons/Button';
import { TextAreaField } from '@/components/forms/Field';
import Toggle from '@/components/forms/Toggle';
import DataTable, { type Column } from '@/components/tables/DataTable';
import useRecord from '@/hooks/useRecord';
import useResource from '@/hooks/useResource';
import { useToast } from '@/lib/providers/ToastProvider';
import { orderService } from '@/features/orders/services/orderService';
import type { Order } from '@/types/models';
import { formatCurrency, formatDate } from '@/utils/format';
import { customerService } from '../services/customerService';
import { statsByCustomer } from '../utils/customerStats';

const orderColumns: Column<Order>[] = [
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
  { key: 'createdAt', header: 'Date', sortValue: (o) => o.createdAt, render: (o) => formatDate(o.createdAt) },
  { key: 'total', header: 'Total', align: 'right', sortValue: (o) => o.total, render: (o) => <span className="num">{formatCurrency(o.total)}</span> },
  { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
];

/** /customers/[id] */
export default function CustomerDetail({ id }: { id: string }) {
  const { record: customer, loading, found, error, setRecord } = useRecord(customerService, id);
  const { items: orders } = useResource(orderService);
  const toast = useToast();
  const [notes, setNotes] = useState<string | null>(null);
  const mine = useMemo(() => orders.filter((o) => o.customerId === id), [orders, id]);
  const stats = statsByCustomer(mine)[id] ?? { orders: 0, spent: 0, lastOrderAt: null };

  if (loading) return <Loading />;
  if (!found || !customer)
    return <EmptyState icon="alert" title={error ? 'Could not load this customer' : 'Customer not found'} text={error ?? undefined} action={<ButtonLink href="/customers">Back to customers</ButtonLink>} />;

  const save = async (patch: Partial<typeof customer>, message: string) => {
    setRecord(await customerService.update(customer.id, patch));
    toast(message);
  };

  return (
    <>
      <PageHeader title={`${customer.firstName} ${customer.lastName}`} description={`Customer since ${formatDate(customer.createdAt)}`} back={{ href: '/customers', label: 'Customers' }} actions={<StatusBadge status={customer.status} />} />
      <div className="grid-stats">
        <StatCard label="Orders" value={String(stats.orders)} icon="cart" />
        <StatCard label="Total spent" value={formatCurrency(stats.spent)} icon="dollar" />
        <StatCard label="Average order" value={formatCurrency(stats.orders ? stats.spent / stats.orders : 0)} icon="chart" />
        <StatCard label="Last order" value={stats.lastOrderAt ? formatDate(stats.lastOrderAt) : '—'} icon="truck" />
      </div>
      <div className="grid-3">
        <Card title="Orders">
          <DataTable caption="Customer orders" columns={orderColumns} rows={mine} rowKey={(o) => o.id} emptyTitle="No orders yet" initialSort={{ key: 'createdAt', dir: 'desc' }} pageSize={10} />
        </Card>
        <div className="form-stack">
          <Card title="Contact">
            <dl className="detail-list">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${customer.email}`} className="link">
                  {customer.email}
                </a>
              </dd>
              <dt>Phone</dt>
              <dd>{customer.phone || '—'}</dd>
              <dt>Location</dt>
              <dd>
                {customer.city}, {customer.state}, {customer.country}
              </dd>
            </dl>
          </Card>
          <Card title="Account">
            <div className="form-stack" style={{ gap: 14 }}>
              <Toggle checked={customer.marketingOptIn} onChange={(v) => save({ marketingOptIn: v }, v ? 'Emails turned on' : 'Emails turned off')} label="Receives marketing emails" />
              <Toggle
                checked={customer.status === 'blocked'}
                onChange={(v) => save({ status: v ? 'blocked' : 'active' }, v ? 'Customer blocked' : 'Customer unblocked')}
                label="Blocked"
                description="Blocked customers can’t sign in or place orders."
              />
            </div>
          </Card>
          <Card title="Notes">
            <div className="form-stack" style={{ gap: 10 }}>
              <TextAreaField id="notes" label="Private notes (customers can’t see these)" value={notes ?? customer.notes} onChange={(e) => setNotes(e.target.value)} />
              <Button
                size="sm"
                disabled={notes === null || notes === customer.notes}
                onClick={async () => {
                  await save({ notes: notes ?? '' }, 'Notes saved');
                  setNotes(null);
                }}
              >
                Save notes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
