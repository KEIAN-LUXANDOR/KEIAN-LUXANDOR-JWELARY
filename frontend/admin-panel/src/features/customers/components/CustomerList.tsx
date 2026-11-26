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
import { orderService } from '@/features/orders/services/orderService';
import type { Customer } from '@/types/models';
import { downloadCsv } from '@/utils/csv';
import { formatCurrency, formatDate } from '@/utils/format';
import { matchesSearch } from '@/utils/text';
import { customerService } from '../services/customerService';
import { statsByCustomer } from '../utils/customerStats';

/** /customers */
export default function CustomerList() {
  const { items, loading, error } = useResource(customerService);
  const { items: orders } = useResource(orderService);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const stats = useMemo(() => statsByCustomer(orders), [orders]);

  const rows = useMemo(
    () => items.filter((c) => (!query || matchesSearch(`${c.firstName} ${c.lastName} ${c.email} ${c.city}`, query)) && (!status || c.status === status)),
    [items, query, status],
  );

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortValue: (c) => `${c.firstName} ${c.lastName}`,
      render: (c) => (
        <div>
          <Link href={`/customers/${c.id}`} className="cell-title">
            {c.firstName} {c.lastName}
          </Link>
          <div className="cell-sub">{c.email}</div>
        </div>
      ),
    },
    { key: 'location', header: 'Location', sortValue: (c) => c.city, render: (c) => `${c.city}, ${c.state}` },
    { key: 'orders', header: 'Orders', align: 'right', sortValue: (c) => stats[c.id]?.orders ?? 0, render: (c) => <span className="num">{stats[c.id]?.orders ?? 0}</span> },
    { key: 'spent', header: 'Total spent', align: 'right', sortValue: (c) => stats[c.id]?.spent ?? 0, render: (c) => <span className="num">{formatCurrency(stats[c.id]?.spent ?? 0)}</span> },
    { key: 'createdAt', header: 'Customer since', sortValue: (c) => c.createdAt, render: (c) => formatDate(c.createdAt) },
    { key: 'status', header: 'Status', sortValue: (c) => c.status, render: (c) => <StatusBadge status={c.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        description={`${items.length} customers · ${items.filter((c) => c.marketingOptIn).length} receive emails`}
        actions={
          <Button
            variant="secondary"
            icon="download"
            disabled={!rows.length}
            onClick={() =>
              downloadCsv(
                'customers.csv',
                ['First name', 'Last name', 'Email', 'Phone', 'City', 'State', 'Orders', 'Total spent', 'Emails OK', 'Status'],
                rows.map((c) => [c.firstName, c.lastName, c.email, c.phone, c.city, c.state, stats[c.id]?.orders ?? 0, stats[c.id]?.spent ?? 0, c.marketingOptIn ? 'yes' : 'no', c.status]),
              )
            }
          >
            Export CSV
          </Button>
        }
      />
      <TableToolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Name, email or city" label="Search customers" />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={[{ value: '', label: 'All customers' }, { value: 'active', label: 'Active' }, { value: 'blocked', label: 'Blocked' }]} />
      </TableToolbar>
      <DataTable caption="Customers" columns={columns} rows={rows} rowKey={(c) => c.id} loading={loading} error={error} initialSort={{ key: 'spent', dir: 'desc' }} onRowClick={(c) => router.push(`/customers/${c.id}`)} />
    </>
  );
}
