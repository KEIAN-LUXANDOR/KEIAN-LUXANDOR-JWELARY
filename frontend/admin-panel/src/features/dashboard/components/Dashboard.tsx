'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import StatCard from '@/components/common/StatCard';
import Badge, { StatusBadge } from '@/components/common/Badge';
import BarChart from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import DataTable, { type Column } from '@/components/tables/DataTable';
import useResource from '@/hooks/useResource';
import { orderService } from '@/features/orders/services/orderService';
import { productService } from '@/features/products/services/productService';
import { customerService } from '@/features/customers/services/customerService';
import { reviewService } from '@/features/reviews/services/reviewService';
import { stockStatus } from '@/features/products/utils/productUtils';
import { useAuth } from '@/features/users/hooks/useAuth';
import { monthlyRevenue, pctChange, revenue, salesBetween, salesByMetal } from '@/features/reports/utils/analytics';
import type { Order } from '@/types/models';
import { daysAgo } from '@/utils/dates';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';

const compactMoney = (v: number) => (v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${Math.round(v)}`);

const recentColumns: Column<Order>[] = [
  {
    key: 'number',
    header: 'Order',
    render: (o) => (
      <Link href={`/orders/${o.id}`} className="cell-title">
        #{o.number}
      </Link>
    ),
  },
  { key: 'customer', header: 'Customer', render: (o) => o.customerName },
  { key: 'date', header: 'Date', render: (o) => formatDate(o.createdAt) },
  { key: 'total', header: 'Total', align: 'right', render: (o) => <span className="num">{formatCurrency(o.total)}</span> },
  { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
];

/** /dashboard — today's picture of the store. */
export default function Dashboard() {
  const { user } = useAuth();
  const { items: orders, loading } = useResource(orderService);
  const { items: products } = useResource(productService);
  const { items: customers } = useResource(customerService);
  const { items: reviews } = useResource(reviewService);

  const stats = useMemo(() => {
    const now = new Date();
    const last30 = salesBetween(orders, daysAgo(30, now), now);
    const prev30 = salesBetween(orders, daysAgo(60, now), daysAgo(30, now));
    const newCustomers = customers.filter((c) => new Date(c.createdAt) >= daysAgo(30, now)).length;
    const prevCustomers = customers.filter((c) => new Date(c.createdAt) >= daysAgo(60, now) && new Date(c.createdAt) < daysAgo(30, now)).length;
    const aov = last30.length ? revenue(last30) / last30.length : 0;
    const prevAov = prev30.length ? revenue(prev30) / prev30.length : 0;
    return {
      revenue: revenue(last30),
      revenueChange: pctChange(revenue(last30), revenue(prev30)),
      orders: last30.length,
      ordersChange: pctChange(last30.length, prev30.length),
      newCustomers,
      customersChange: pctChange(newCustomers, prevCustomers),
      aov,
      aovChange: pctChange(aov, prevAov),
    };
  }, [orders, customers]);

  const toShip = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing');
  const lowStock = products.filter((p) => p.status === 'active' && stockStatus(p) !== 'In stock').sort((a, b) => a.stock - b.stock);
  const pendingReviews = reviews.filter((r) => r.status === 'pending').length;
  const firstName = user?.name.split(/\s+/)[0] ?? '';

  return (
    <>
      <PageHeader title={`Welcome back${firstName ? `, ${firstName}` : ''}`} description="Your store over the last 30 days." />

      {(toShip.length > 0 || lowStock.length > 0 || pendingReviews > 0) && (
        <div className="alert alert--warning" role="status">
          <strong>To do: </strong>
          {[
            toShip.length > 0 && (
              <Link key="o" href="/orders" className="link">
                {toShip.length} orders to ship
              </Link>
            ),
            lowStock.length > 0 && (
              <Link key="s" href="/inventory" className="link">
                {lowStock.length} products low or out of stock
              </Link>
            ),
            pendingReviews > 0 && (
              <Link key="r" href="/reviews" className="link">
                {pendingReviews} reviews to approve
              </Link>
            ),
          ]
            .filter(Boolean)
            .flatMap((el, i) => (i ? [' · ', el] : [el]))}
        </div>
      )}

      <div className="grid-stats">
        <StatCard label="Revenue" value={formatCurrency(stats.revenue)} icon="dollar" change={stats.revenueChange} />
        <StatCard label="Orders" value={formatNumber(stats.orders)} icon="cart" change={stats.ordersChange} />
        <StatCard label="Average order" value={formatCurrency(stats.aov)} icon="chart" change={stats.aovChange} />
        <StatCard label="New customers" value={formatNumber(stats.newCustomers)} icon="users" change={stats.customersChange} />
      </div>

      <div className="grid-3">
        <Card title="Revenue — last 12 months" actions={<Link href="/reports" className="link">Reports</Link>}>
          <BarChart data={monthlyRevenue(orders, 12)} title="Revenue by month for the last 12 months" formatValue={compactMoney} />
        </Card>
        <Card title="Sales by metal">
          <DonutChart data={salesByMetal(orders)} title="Share of sales by metal" formatValue={compactMoney} />
        </Card>
      </div>

      <div className="grid-3">
        <Card title="Latest orders" actions={<Link href="/orders" className="link">All orders</Link>}>
          <DataTable caption="Latest orders" columns={recentColumns} rows={orders.slice(0, 6)} rowKey={(o) => o.id} loading={loading} />
        </Card>
        <Card title="Low stock" actions={<Link href="/inventory" className="link">Inventory</Link>}>
          {lowStock.length === 0 ? (
            <p className="muted">Everything is well stocked.</p>
          ) : (
            <ul className="list-plain">
              {lowStock.slice(0, 7).map((p) => (
                <li key={p.id} className="list-row">
                  <Link href={`/products/${p.id}`} className="link" style={{ textDecoration: 'none' }}>
                    {p.name}
                  </Link>
                  <Badge tone={p.stock === 0 ? 'danger' : 'warning'}>{p.stock === 0 ? 'Out of stock' : `${p.stock} left`}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
