import type { Metadata } from 'next';
import AccountShell from '@/features/customer-profile/components/AccountShell';
import AddressBook from '@/features/customer-profile/components/AddressBook';

export const metadata: Metadata = { title: 'My Addresses' };

export default function AddressesPage() {
  return (
    <AccountShell title="My Addresses">
      <AddressBook />
    </AccountShell>
  );
}
