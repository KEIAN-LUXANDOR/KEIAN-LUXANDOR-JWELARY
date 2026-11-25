import type { Metadata } from 'next';
import PageHero from '@/components/common/PageHero';
import CartView from '@/features/cart/components/CartView';

export const metadata: Metadata = { title: 'Shopping Bag' };

// Shopping cart.
export default function CartPage() {
  return (
    <>
      <PageHero title="Shopping Bag" crumbs={[{ label: 'Bag' }]} />
      <CartView />
    </>
  );
}
