import type { Metadata } from 'next';
import PageHero from '@/components/common/PageHero';
import OrderConfirmation from '@/features/orders/components/OrderConfirmation';

export const metadata: Metadata = { title: 'Order Confirmation', robots: { index: false } };

type Props = { searchParams: Promise<{ order?: string | string[] }> };

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const raw = (await searchParams).order;
  const orderId = (Array.isArray(raw) ? raw[0] : raw) ?? null;
  return (
    <>
      <PageHero title="Order Confirmed" crumbs={[{ label: 'Order Confirmation' }]} />
      <OrderConfirmation orderId={orderId} />
    </>
  );
}
