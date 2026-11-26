import type { Metadata } from 'next';
import OrderList from '@/features/orders/components/OrderList';

export const metadata: Metadata = { title: 'Orders' };

// Address: /orders
export default function Page() {
  return <OrderList />;
}
