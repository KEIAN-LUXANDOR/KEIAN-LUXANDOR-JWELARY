import type { Metadata } from 'next';
import AccountShell from '@/features/customer-profile/components/AccountShell';
import OrderList from '@/features/orders/components/OrderList';

export const metadata: Metadata = { title: 'My Orders' };

export default function OrdersPage() {
  return (
    <AccountShell title="My Orders">
      <OrderList />
    </AccountShell>
  );
}
