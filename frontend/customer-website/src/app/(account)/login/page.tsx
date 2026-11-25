import type { Metadata } from 'next';
import PageHero from '@/components/common/PageHero';
import LoginForm from '@/features/authentication/components/LoginForm';

export const metadata: Metadata = { title: 'Sign In' };

type Props = { searchParams: Promise<{ next?: string | string[] }> };

export default async function LoginPage({ searchParams }: Props) {
  const raw = (await searchParams).next;
  const next = Array.isArray(raw) ? raw[0] : raw;
  return (
    <>
      <PageHero title="Sign In" text="Access your orders, addresses and saved pieces." crumbs={[{ label: 'Sign In' }]} />
      <section className="section container auth">
        <LoginForm next={next} />
      </section>
    </>
  );
}
