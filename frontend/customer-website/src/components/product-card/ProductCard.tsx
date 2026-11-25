import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Tone } from '@/types/common';
import Media from '@/components/common/Media';
import './ProductCard.css';

export interface ProductCardProps {
  href: string;
  name: string;
  price: string;
  tone: Tone;
  /** Used to pick a placeholder drawing when there is no image. */
  label: string;
  image?: string;
  badge?: string | null;
  /** Buttons over the image (wishlist, quick add). Supplied by features/products. */
  actions?: ReactNode;
}

/** Presentational product tile. features/products/components/ProductCard adds cart & wishlist actions. */
export default function ProductCard({ href, name, price, tone, label, image, badge, actions }: ProductCardProps) {
  return (
    <article className="pcard">
      <div className="pcard__media">
        <Link href={href} aria-label={name} tabIndex={-1}>
          <Media src={image} tone={tone} label={label} alt={name} ratio="4 / 5" />
        </Link>
        {badge && <span className="pcard__badge">{badge}</span>}
        {actions}
      </div>
      <Link href={href} className="pcard__info">
        <h3 className="pcard__name">{name}</h3>
        <p className="pcard__price">{price}</p>
      </Link>
    </article>
  );
}
