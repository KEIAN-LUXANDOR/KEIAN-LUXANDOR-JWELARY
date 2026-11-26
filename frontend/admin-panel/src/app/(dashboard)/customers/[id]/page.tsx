import type { Metadata } from 'next';
import CustomerDetail from '@/features/customers/components/CustomerDetail';

export const metadata: Metadata = { title: 'Customer' };

// Address: /customers/[id]
export default async function Page({ params }: PageProps<'/customers/[id]'>) {
  const { id } = await params;
  return <CustomerDetail key={id} id={id} />;
}
