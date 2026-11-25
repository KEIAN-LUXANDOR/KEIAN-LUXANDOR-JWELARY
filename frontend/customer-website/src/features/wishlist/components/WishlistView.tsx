'use client';

import Link from 'next/link';
import PageHero from '@/components/common/PageHero';
import ProductGrid from '@/features/products/components/ProductGrid';
import { useWishlist } from '../hooks/useWishlist';

export default function WishlistView() {
  const { wishlist, ready } = useWishlist();
  const count = ready ? wishlist.length : 0;
  return (
    <>
      <PageHero title="Wishlist" crumbs={[{ label: 'Wishlist' }]} text={ready ? `${count} saved ${count === 1 ? 'piece' : 'pieces'}` : undefined} />
      <section className="section container">
        {!ready ? null : wishlist.length === 0 ? (
          <div className="empty-state">
            <p className="serif">Your wishlist is empty.</p>
            <p className="muted">Tap the heart on any piece to save it here.</p>
            <Link href="/collections/new-arrivals" className="btn">
              Explore New Arrivals
            </Link>
          </div>
        ) : (
          <ProductGrid products={wishlist} />
        )}
      </section>
    </>
  );
}
