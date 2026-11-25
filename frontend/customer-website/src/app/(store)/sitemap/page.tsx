import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/common/PageHero';
import { NAV_MENUS } from '@/lib/data/navigation';

export const metadata: Metadata = { title: 'Sitemap' };

export default function SitemapPage() {
  return (
    <>
      <PageHero title="Sitemap" crumbs={[{ label: 'Sitemap' }]} />
      <section className="section container sitemap">
        {NAV_MENUS.map((m) => (
          <div key={m.id}>
            <h3>
              <Link href={m.to}>{m.label}</Link>
            </h3>
            <ul>
              {m.columns
                .flatMap((c) => c.links)
                .map((l) => (
                  <li key={l.label + l.to}>
                    <Link href={l.to}>{l.label}</Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
