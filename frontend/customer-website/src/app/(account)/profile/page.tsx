import type { Metadata } from 'next';
import AccountShell from '@/features/customer-profile/components/AccountShell';
import ProfileForm from '@/features/customer-profile/components/ProfileForm';

export const metadata: Metadata = { title: 'My Profile' };

export default function ProfilePage() {
  return (
    <AccountShell title="My Profile">
      <ProfileForm />
    </AccountShell>
  );
}
