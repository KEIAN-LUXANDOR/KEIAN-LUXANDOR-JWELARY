import Link from 'next/link';
import { HERO } from '@/lib/data/home';
import Media from '@/components/common/Media';

export default function Hero() {
  return (
    <section className="hero">
      <Media className="hero__media" src={HERO.image} tone={HERO.tone} kind="bracelet" alt={HERO.title} ratio="auto" eager />
      <div className="hero__content container">
        <p className="eyebrow">{HERO.eyebrow}</p>
        <h1>{HERO.title}</h1>
        <Link href={HERO.cta.to} className="btn">{HERO.cta.label}</Link>
      </div>
    </section>
  );
}