import type { Metadata } from 'next';
import PageHero from '@/components/common/PageHero';
import CheckoutForm from '@/features/checkout/components/CheckoutForm';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

// Place an order.
export default function CheckoutPage() {
  return (
    <>
      <PageHero title="Checkout" crumbs={[{ label: 'Bag', to: '/cart' }, { label: 'Checkout' }]} />
      <CheckoutForm />
    </>
  );
}
