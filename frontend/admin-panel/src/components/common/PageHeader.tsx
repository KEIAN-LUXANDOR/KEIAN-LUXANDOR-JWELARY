import Link from 'next/link';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  back?: { href: string; label: string };
}

/** Title row at the top of every admin page. */
export default function PageHeader({ title, description, actions, back }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        {back && (
          <Link href={back.href} className="page-header__back">
            ← {back.label}
          </Link>
        )}
        <h1 className="page-header__title">{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
