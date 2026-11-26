import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataTable, { type Column } from '@/components/tables/DataTable';

interface Row {
  id: string;
  name: string;
  price: number;
}

const rows: Row[] = Array.from({ length: 23 }, (_, i) => ({ id: String(i + 1), name: `Ring ${String(i + 1).padStart(2, '0')}`, price: (i + 1) * 100 }));
const columns: Column<Row>[] = [
  { key: 'name', header: 'Name', sortValue: (r) => r.name },
  { key: 'price', header: 'Price', sortValue: (r) => r.price, render: (r) => `$${r.price}` },
];

const bodyRows = () => within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row');

describe('DataTable', () => {
  it('shows one page of rows and moves between pages', async () => {
    render(<DataTable caption="Test" columns={columns} rows={rows} rowKey={(r) => r.id} pageSize={10} />);
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText('1–10 of 23')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('11–20 of 23')).toBeInTheDocument();
    expect(screen.getByText('Ring 11')).toBeInTheDocument();
  });

  it('sorts when a column header is clicked, and reverses on a second click', async () => {
    render(<DataTable caption="Test" columns={columns} rows={rows} rowKey={(r) => r.id} pageSize={5} />);
    const priceHeader = screen.getByRole('button', { name: /price/i });
    await userEvent.click(priceHeader);
    expect(bodyRows()[0]).toHaveTextContent('$100');
    await userEvent.click(priceHeader);
    expect(bodyRows()[0]).toHaveTextContent('$2300');
    expect(screen.getByRole('columnheader', { name: /price/i })).toHaveAttribute('aria-sort', 'descending');
  });

  it('shows the empty message when there are no rows', () => {
    render(<DataTable caption="Test" columns={columns} rows={[]} rowKey={(r) => r.id} emptyTitle="No products yet" />);
    expect(screen.getByText('No products yet')).toBeInTheDocument();
  });

  it('shows the error instead of the table', () => {
    render(<DataTable caption="Test" columns={columns} rows={rows} rowKey={(r) => r.id} error="Server error 500" />);
    expect(screen.getByText('Could not load data')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('opens a row on click, but not when a button inside the row is clicked', async () => {
    const onRowClick = vi.fn();
    const withButton: Column<Row>[] = [...columns, { key: 'x', header: '', render: () => <button type="button">Delete</button> }];
    render(<DataTable caption="Test" columns={withButton} rows={rows.slice(0, 2)} rowKey={(r) => r.id} onRowClick={onRowClick} />);
    await userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(onRowClick).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText('Ring 02'));
    expect(onRowClick).toHaveBeenCalledWith(rows[1]);
  });
});
