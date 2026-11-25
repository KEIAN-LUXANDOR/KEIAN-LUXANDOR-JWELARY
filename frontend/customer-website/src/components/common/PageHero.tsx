import Link from 'next/link';

interface Crumb {
  label: string;
  to?: string;
}

// Title band with breadcrumbs used on inner pages.
export default function PageHero({ title, text, crumbs = [] }: { title: string; text?: string; crumbs?: Crumb[] }) {
  return (
    <section className="page-hero">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}>
              <span aria-hidden="true">/ </span>
              {c.to ? <Link href={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}