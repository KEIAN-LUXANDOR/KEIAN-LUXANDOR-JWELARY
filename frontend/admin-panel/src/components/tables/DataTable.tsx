'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Icon from '@/components/common/Icon';
import EmptyState from '@/components/common/EmptyState';
import Pagination from './Pagination';

export interface Column<T> {
  key: string;
  header: string;
  /** What to show in the cell. Defaults to row[key]. */
  render?: (row: T) => ReactNode;
  /** Value used for sorting. Leave out to make the column not sortable. */
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyText?: string;
  pageSize?: number;
  /** Starting sort, e.g. { key: 'createdAt', dir: 'desc' } */
  initialSort?: { key: string; dir: 'asc' | 'desc' };
  onRowClick?: (row: T) => void;
  caption: string; // describes the table for screen readers
}

/** Sortable, paginated table used on every list page. Search and filters are done by the page, before `rows`. */
export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  emptyTitle = 'Nothing here yet',
  emptyText,
  pageSize = 15,
  initialSort,
  onRowClick,
  caption,
}: DataTableProps<T>) {
  const [sort, setSort] = useState(initialSort ?? null);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const get = col.sortValue;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = get(a);
      const vb = get(b);
      return (typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))) * dir;
    });
  }, [rows, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount);
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize);

  const toggleSort = (key: string) => setSort((s) => (s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));

  if (error) return <EmptyState icon="alert" title="Could not load data" text={error} />;

  return (
    <div className="table-wrap">
      <div className="table-scroll">
        <table className="table">
          <caption className="visually-hidden">{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <th key={c.key} style={{ width: c.width, textAlign: c.align }} aria-sort={active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : undefined} scope="col">
                    {c.sortValue ? (
                      <button type="button" className={`th-sort ${active ? 'is-active' : ''}`} onClick={() => toggleSort(c.key)}>
                        {c.header}
                        <Icon name={active && sort!.dir === 'desc' ? 'arrowDown' : 'arrowUp'} size={12} />
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="row--loading">
                    {columns.map((c) => (
                      <td key={c.key}>
                        <span className="skeleton" />
                      </td>
                    ))}
                  </tr>
                ))
              : visible.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className={onRowClick ? 'row--clickable' : undefined}
                    onClick={onRowClick ? (e) => !(e.target as HTMLElement).closest('a,button,input,select,label') && onRowClick(row) : undefined}
                  >
                    {columns.map((c) => (
                      <td key={c.key} style={{ textAlign: c.align }}>
                        {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {!loading && rows.length === 0 && <EmptyState title={emptyTitle} text={emptyText} />}
      {!loading && rows.length > pageSize && <Pagination page={current} pageCount={pageCount} total={rows.length} pageSize={pageSize} onChange={setPage} />}
    </div>
  );
}
