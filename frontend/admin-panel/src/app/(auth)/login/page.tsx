import type { Metadata } from 'next';
import AuthCard from '@/components/common/AuthCard';
import LoginForm from '@/features/users/components/LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

// Address: /login
export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const raw = (await searchParams).next;
  const next = (Array.isArray(raw) ? raw[0] : raw) ?? null;
  return (
    <AuthCard title="Admin sign in" text="Manage products, orders and customers.">
      <LoginForm next={next} />
    </AuthCard>
  );
}
