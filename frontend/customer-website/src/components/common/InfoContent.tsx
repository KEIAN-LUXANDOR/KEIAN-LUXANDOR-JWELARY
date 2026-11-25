import { notFound } from 'next/navigation';
import { INFO_PAGES } from '@/lib/data/infoPages';
import PageHero from './PageHero';

/** Guide / policy page body, looked up by topic. */
export default function InfoContent({ topic }: { topic: string }) {
  const page = INFO_PAGES[topic];
  if (!page) notFound();
  return (
    <>
      <PageHero title={page.title} crumbs={[{ label: page.title }]} />
      <section className="section container prose">
        {page.sections.map(([h, t]) => (
          <div key={h}>
            <h2>{h}</h2>
            <p>{t}</p>
          </div>
        ))}
      </section>
    </>
  );
}
