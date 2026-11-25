import type { ReactNode } from 'react';
import PageHero from '@/components/common/PageHero';
import AccountNav from '@/features/authentication/components/AccountNav';
import RequireAuth from '@/features/authentication/components/RequireAuth';
import './account.css';

/** Frame for signed-in account pages: title, side navigation, login guard. */
export default function AccountShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <PageHero title={title} crumbs={[{ label: 'My Account', to: '/profile' }, { label: title }]} />
      <RequireAuth>
        <section className="section container account">
          <AccountNav />
          <div>{children}</div>
        </section>
      </RequireAuth>
    </>
  );
}
