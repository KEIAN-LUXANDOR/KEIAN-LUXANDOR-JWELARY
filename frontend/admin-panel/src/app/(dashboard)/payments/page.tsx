import type { Metadata } from 'next';
import PaymentList from '@/features/payments/components/PaymentList';

export const metadata: Metadata = { title: 'Payments' };

// Address: /payments
export default function Page() {
  return <PaymentList />;
}
