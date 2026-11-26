'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/header/Header';
import Loading from '@/components/common/Loading';
import AccessDenied from '@/components/common/AccessDenied';
import { useAuth } from '@/features/users/hooks/useAuth';
import { can, permissionForPath } from '@/features/users/utils/permissions';

// Frame for every signed-in admin page: sidebar + top bar.
// Sends visitors who aren't signed in to /login.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menu, setMenu] = useState<{ open: boolean; path: string }>({ open: false, path: pathname });
  const menuOpen = menu.open && menu.path === pathname; // the mobile menu closes when the page changes

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, router, pathname]);

  if (!ready || !user) return <Loading label="Checking your sign-in…" />;

  return (
    <div className="shell">
      <Sidebar user={user} open={menuOpen} onClose={() => setMenu({ open: false, path: pathname })} />
      <div className="shell__main">
        <Header user={user} onMenu={() => setMenu({ open: true, path: pathname })} onLogout={logout} />
        <main id="main" className="content">
          {can(user, permissionForPath(pathname)) ? children : <AccessDenied />}
        </main>
      </div>
    </div>
  );
}
