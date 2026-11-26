import type { Metadata } from 'next';
import UserManager from '@/features/users/components/UserManager';

export const metadata: Metadata = { title: 'Admin Users' };

// Address: /users
export default function Page() {
  return <UserManager />;
}
