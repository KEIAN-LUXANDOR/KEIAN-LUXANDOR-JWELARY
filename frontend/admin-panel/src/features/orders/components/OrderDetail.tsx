'use client';

import Link from 'next/link';
import { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/Badge';
import MetalSwatch from '@/components/common/MetalSwatch';
import Button, { ButtonLink } from '@/components/buttons/Button';
import { SelectField, TextAreaField, TextField } from '@/components/forms/Field';
import DataTable, { type Column } from '@/components/tables/DataTable';
import useRecord from '@/hooks/useRecord';
import { useToast } from '@/lib/providers/ToastProvider';
import type { OrderItem, OrderStatus } from '@/types/models';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { changeOrderStatus, orderService } from '../services/orderService';
import { NEXT_STATUSES } from '../utils/orderUtils';

const itemColumns: Column<OrderItem>[] = [
  {
    key: 'name',
    header: 'Item',
    render: (i) => (
      <div>
        <Link href={`/products/${i.productId}`} className="cell-title">
          {i.name}
        </Link>
        <div className="cell-sub">
          {i.sku}
          {i.size ? ` · Size ${i.size}` : ''}
        </div>
      </div>
    ),
  },
  { key: 'metal', header: 'Metal', render: (i) => <MetalSwatch metal={i.metal} /> },
  { key: 'qty', header: 'Qty', align: 'right', render: (i) => <span className="num">{i.qty}</span> },
  { key: 'price', header: 'Price', align: 'right', render: (i) => <span className="num">{formatCurrency(i.price)}</span> },
  { key: 'total', header: 'Total', align: 'right', render: (i) => <span className="num">{formatCurrency(i.price * i.qty)}</span> },
];

/** /orders/[id] */
export default function OrderDetail({ id }: { id: string }) {
  const { record: order, loading, found, error, setRecord } = useRecord(orderService, id);
  const toast = useToast();
  const [next, setNext] = useState<OrderStatus | ''>('');
  const [note, setNote] = useState('');
  const [tracking, setTracking] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) return <Loading />;
  if (!found || !order)
    return <EmptyState icon="alert" title={error ? 'Could not load this order' : 'Order not found'} text={error ?? undefined} action={<ButtonLink href="/orders">Back to orders</ButtonLink>} />;

  const options = NEXT_STATUSES[order.status];
  const a = order.shippingAddress;

  const save = async () => {
    if (!next) return;
    setBusy(true);
    try {
      const updated = await changeOrderStatus(order, next, note, next === 'Shipped' ? tracking.trim() : undefined);
      setRecord(updated);
      setNext('');
      setNote('');
      toast(`Order #${order.number} marked as ${next}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title={`Order #${order.number}`}
        description={`Placed ${formatDateTime(order.createdAt)}`}
        back={{ href: '/orders', label: 'Orders' }}
        actions={
          <>
            <StatusBadge status={order.paymentStatus} />
            <StatusBadge status={order.status} />
          </>
        }
      />
      <div className="grid-3">
        <div className="form-stack">
          <Card title="Items">
            <DataTable caption="Order items" columns={itemColumns} rows={order.items} rowKey={(i) => `${i.productId}-${i.size}`} />
            <dl className="totals">
              <dt>Subtotal</dt>
              <dd className="num">{formatCurrency(order.subtotal)}</dd>
              {order.discount > 0 && (
                <>
                  <dt>Discount {order.couponCode && <span className="muted">({order.couponCode})</span>}</dt>
                  <dd className="num">−{formatCurrency(order.discount)}</dd>
                </>
              )}
              <dt>Shipping</dt>
              <dd className="num">{order.shipping ? formatCurrency(order.shipping) : 'Free'}</dd>
              <dt>Tax</dt>
              <dd className="num">{formatCurrency(order.tax)}</dd>
              <dt className="totals__grand">Total</dt>
              <dd className="totals__grand num">{formatCurrency(order.total)}</dd>
            </dl>
          </Card>
          <Card title="History">
            <ol className="timeline">
              {[...order.timeline].reverse().map((e, i) => (
                <li key={`${e.at}-${i}`}>
                  <span className="timeline__dot" aria-hidden="true" />
                  <div>
                    <strong>{e.status}</strong> — {e.note}
                    <div className="timeline__when">{formatDateTime(e.at)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
        <div className="form-stack">
          <Card title="Update status">
            {options.length === 0 ? (
              <p className="muted">This order is {order.status.toLowerCase()} — no further changes.</p>
            ) : (
              <div className="form-stack" style={{ gap: 14 }}>
                <SelectField
                  id="next-status"
                  label="Change to"
                  value={next}
                  onChange={(e) => setNext(e.target.value as OrderStatus)}
                  options={[{ value: '', label: 'Choose…' }, ...options.map((s) => ({ value: s, label: s }))]}
                />
                {next === 'Shipped' && <TextField id="tracking" label="Tracking number" value={tracking} onChange={(e) => setTracking(e.target.value)} />}
                <TextAreaField id="note" label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} hint="Saved in the order history" />
                <Button onClick={save} disabled={!next} loading={busy}>
                  Save status
                </Button>
              </div>
            )}
          </Card>
          <Card title="Customer">
            <dl className="detail-list">
              <dt>Name</dt>
              <dd>
                <Link href={`/customers/${order.customerId}`} className="link">
                  {order.customerName}
                </Link>
              </dd>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${order.email}`} className="link">
                  {order.email}
                </a>
              </dd>
              <dt>Phone</dt>
              <dd>{a.phone || '—'}</dd>
            </dl>
          </Card>
          <Card title="Ship to">
            <address style={{ fontStyle: 'normal', lineHeight: 1.7 }}>
              {a.name}
              <br />
              {a.line1}
              {a.line2 && (
                <>
                  <br />
                  {a.line2}
                </>
              )}
              <br />
              {a.city}, {a.state} {a.zip}
              <br />
              {a.country}
            </address>
            {order.trackingNumber && (
              <p style={{ marginTop: 10 }}>
                Tracking: <strong>{order.trackingNumber}</strong>
              </p>
            )}
          </Card>
          <Card title="Payment">
            <dl className="detail-list">
              <dt>Method</dt>
              <dd>{order.paymentMethod}</dd>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={order.paymentStatus} />
              </dd>
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
