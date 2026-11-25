'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

/** Shows children only to signed-in customers; sends everyone else to /login. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { customer, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !customer) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, customer, router, pathname]);

  if (!ready || !customer) return <section className="section container" aria-busy="true" />;
  return <>{children}</>;
}
