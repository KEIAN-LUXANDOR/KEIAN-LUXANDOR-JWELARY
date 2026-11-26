import type { Metadata } from 'next';
import OrderDetail from '@/features/orders/components/OrderDetail';

export const metadata: Metadata = { title: 'Order' };

// Address: /orders/[id]
export default async function Page({ params }: PageProps<'/orders/[id]'>) {
  const { id } = await params;
  return <OrderDetail key={id} id={id} />;
}
