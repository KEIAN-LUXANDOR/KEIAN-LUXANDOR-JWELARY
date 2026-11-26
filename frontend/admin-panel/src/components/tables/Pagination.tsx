import IconButton from '@/components/buttons/IconButton';

export default function Pagination({ page, pageCount, total, pageSize, onChange }: { page: number; pageCount: number; total: number; pageSize: number; onChange: (page: number) => void }) {
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <nav className="pagination" aria-label="Pages">
      <span className="muted">
        {from}–{to} of {total}
      </span>
      <IconButton icon="chevronLeft" label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)} />
      <span className="pagination__page">
        Page {page} of {pageCount}
      </span>
      <IconButton icon="chevronRight" label="Next page" disabled={page >= pageCount} onClick={() => onChange(page + 1)} />
    </nav>
  );
}
