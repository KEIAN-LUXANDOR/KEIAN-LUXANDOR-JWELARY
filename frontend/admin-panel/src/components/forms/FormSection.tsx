import type { ReactNode } from 'react';

/** A titled card that groups related form fields in a two-column grid. */
export default function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="card form-section">
      <header className="form-section__head">
        <h2 className="card__title">{title}</h2>
        {description && <p className="muted">{description}</p>}
      </header>
      <div className="form-grid">{children}</div>
    </section>
  );
}
