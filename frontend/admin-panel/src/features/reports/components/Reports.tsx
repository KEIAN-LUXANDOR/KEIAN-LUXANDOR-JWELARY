'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import StatCard from '@/components/common/StatCard';
import Loading from '@/components/common/Loading';
import Button from '@/components/buttons/Button';
import FilterSelect from '@/components/forms/FilterSelect';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import DonutChart from '@/components/charts/DonutChart';
import DataTable, { type Column } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/common/Badge';
import useResource from '@/hooks/useResource';
import { ORDER_STATUSES } from '@/lib/constants';
import { orderService } from '@/features/orders/services/orderService';
import { productService } from '@/features/products/services/productService';
import { categoryService } from '@/features/categories/services/categoryService';
import { downloadCsv } from '@/utils/csv';
import { daysAgo, isWithin } from '@/utils/dates';
import { formatCurrency, formatNumber } from '@/utils/format';
import { dailyRevenue, monthlyRevenue, pctChange, revenue, salesBetween, salesByCategory, salesByMetal, topProducts, type TopProduct } from '../utils/analytics';

const PERIODS = [
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: '365', label: 'Last 12 months' },
];

const compactMoney = (v: number) => (v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${Math.round(v)}`);

const topColumns: Column<TopProduct>[] = [
  {
    key: 'name',
    header: 'Product',
    render: (t) => (
      <div>
        <div className="cell-title">{t.name}</div>
        <div className="cell-sub">{t.sku}</div>
      </div>
    ),
  },
  { key: 'units', header: 'Units', align: 'right', sortValue: (t) => t.units, render: (t) => <span className="num">{t.units}</span> },
  { key: 'revenue', header: 'Revenue', align: 'right', sortValue: (t) => t.revenue, render: (t) => <span className="num">{formatCurrency(t.revenue)}</span> },
];

/** /reports — sales over a chosen period. */
export default function Reports() {
  const { items: orders, loading } = useResource(orderService);
  const { items: products } = useResource(productService);
  const { items: categories } = useResource(categoryService);
  const [period, setPeriod] = useState('30');
  const days = Number(period);

  const data = useMemo(() => {
    const now = new Date();
    const from = daysAgo(days, now);
    const inPeriod = orders.filter((o) => isWithin(o.createdAt, from, now));
    const sales = salesBetween(orders, from, now);
    const previous = salesBetween(orders, daysAgo(days * 2, now), from);
    const units = sales.reduce((s, o) => s + o.items.reduce((u, i) => u + i.qty, 0), 0);
    const refunds = inPeriod.filter((o) => o.status === 'Refunded').reduce((s, o) => s + o.total, 0);
    const discounts = sales.reduce((s, o) => s + o.discount, 0);
    return {
      inPeriod,
      sales,
      revenue: revenue(sales),
      change: pctChange(revenue(sales), revenue(previous)),
      orders: sales.length,
      aov: sales.length ? revenue(sales) / sales.length : 0,
      units,
      refunds,
      discounts,
      trend: days === 365 ? monthlyRevenue(orders, 12, now) : dailyRevenue(orders, days, now),
      byMetal: salesByMetal(sales),
      byCategory: salesByCategory(sales, products, categories),
      top: topProducts(sales, 10),
      byStatus: ORDER_STATUSES.map((s) => ({ status: s, count: inPeriod.filter((o) => o.status === s).length })),
    };
  }, [orders, products, categories, days]);

  if (loading) return <Loading />;

  const periodLabel = PERIODS.find((p) => p.value === period)!.label.toLowerCase();

  return (
    <>
      <PageHeader
        title="Reports"
        description={`Sales for the ${periodLabel}. Cancelled and refunded orders are not counted as sales.`}
        actions={
          <>
            <FilterSelect label="Period" value={period} onChange={setPeriod} options={PERIODS} />
            <Button
              variant="secondary"
              icon="download"
              onClick={() =>
                downloadCsv(
                  `sales-${period}-days.csv`,
                  ['Order', 'Date', 'Customer', 'Items', 'Subtotal', 'Discount', 'Tax', 'Total', 'Status'],
                  data.inPeriod.map((o) => [o.number, o.createdAt.slice(0, 10), o.customerName, o.items.reduce((u, i) => u + i.qty, 0), o.subtotal, o.discount, o.tax, o.total, o.status]),
                )
              }
            >
              Download CSV
            </Button>
          </>
        }
      />
      <div className="grid-stats">
        <StatCard label="Revenue" value={formatCurrency(data.revenue)} icon="dollar" change={data.change} hint="vs the period before" />
        <StatCard label="Orders" value={formatNumber(data.orders)} icon="cart" hint={`${formatNumber(data.units)} pieces sold`} />
        <StatCard label="Average order" value={formatCurrency(data.aov)} icon="chart" />
        <StatCard label="Refunds" value={formatCurrency(data.refunds)} icon="arrowDown" hint={`${formatCurrency(data.discounts)} given in discounts`} />
      </div>
      <Card title={days === 365 ? 'Revenue by month' : 'Revenue by day'}>
        {days === 365 ? (
          <BarChart data={data.trend} title="Revenue by month" formatValue={compactMoney} />
        ) : (
          <LineChart data={data.trend} title={`Revenue by day, ${periodLabel}`} formatValue={compactMoney} />
        )}
      </Card>
      <div className="grid-2">
        <Card title="Sales by category">
          {data.byCategory.length ? <BarChart data={data.byCategory.map((c) => ({ label: c.label.replace(' Rings', '').replace('Wedding Bands', 'Wedding'), value: c.value }))} title="Sales by category" formatValue={compactMoney} /> : <p className="muted">No sales in this period.</p>}
        </Card>
        <Card title="Sales by metal">
          <DonutChart data={data.byMetal} title="Sales by metal" formatValue={compactMoney} />
        </Card>
      </div>
      <div className="grid-3">
        <Card title="Best-selling products">
          <DataTable caption="Best-selling products" columns={topColumns} rows={data.top} rowKey={(t) => t.productId} emptyTitle="No sales in this period" pageSize={10} />
        </Card>
        <Card title="Orders by status">
          <ul className="list-plain">
            {data.byStatus.map((s) => (
              <li key={s.status} className="list-row">
                <StatusBadge status={s.status} />
                <span className="num">{s.count}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
