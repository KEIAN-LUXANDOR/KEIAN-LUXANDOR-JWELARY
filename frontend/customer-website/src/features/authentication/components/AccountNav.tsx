'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

const LINKS = [
  { href: '/profile', label: 'Profile' },
  { href: '/orders', label: 'Orders' },
  { href: '/addresses', label: 'Addresses' },
  { href: '/wishlist', label: 'Wishlist' },
];

/** Side navigation shown on account pages. */
export default function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  return (
    <nav className="account-nav" aria-label="Account">
      <ul>
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={pathname === l.href ? 'is-active' : ''} aria-current={pathname === l.href ? 'page' : undefined}>
              {l.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={async () => {
              await logout();
              router.push('/');
            }}
          >
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
}
