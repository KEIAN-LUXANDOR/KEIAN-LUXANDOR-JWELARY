import type { Metadata } from 'next';
import PageHero from '@/components/common/PageHero';
import RegisterForm from '@/features/authentication/components/RegisterForm';

export const metadata: Metadata = { title: 'Create Account' };

type Props = { searchParams: Promise<{ next?: string | string[] }> };

export default async function RegisterPage({ searchParams }: Props) {
  const raw = (await searchParams).next;
  const next = Array.isArray(raw) ? raw[0] : raw;
  return (
    <>
      <PageHero title="Create Account" text="Track orders, save addresses and keep your wishlist in one place." crumbs={[{ label: 'Create Account' }]} />
      <section className="section container auth">
        <RegisterForm next={next} />
      </section>
    </>
  );
}
