import type { Metadata } from 'next';
import CustomerList from '@/features/customers/components/CustomerList';

export const metadata: Metadata = { title: 'Customers' };

// Address: /customers
export default function Page() {
  return <CustomerList />;
}
