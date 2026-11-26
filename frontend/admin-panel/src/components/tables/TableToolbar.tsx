import type { ReactNode } from 'react';

/** Row of search box and filters above a table. */
export default function TableToolbar({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="table-toolbar">
      <div className="table-toolbar__filters">{children}</div>
      {actions && <div className="table-toolbar__actions">{actions}</div>}
    </div>
  );
}
