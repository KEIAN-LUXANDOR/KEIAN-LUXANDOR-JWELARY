'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/common/Icon';
import Logo from '@/components/common/Logo';
import { can } from '@/features/users/utils/permissions';
import type { AdminUser } from '@/types/models';
import { activeHref, NAV_GROUPS } from './navItems';

interface SidebarProps {
  user: AdminUser;
  open: boolean; // mobile drawer
  onClose: () => void;
}

export default function Sidebar({ user, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const current = activeHref(pathname);

  return (
    <>
      <aside className={`sidebar ${open ? 'is-open' : ''}`} aria-label="Admin menu">
        <div className="sidebar__brand">
          <Link href="/dashboard" onClick={onClose} aria-label="Dashboard">
            <Logo light height={30} />
          </Link>
          <span className="sidebar__tag">Admin</span>
        </div>
        <nav className="sidebar__nav">
          {NAV_GROUPS.map((group) => {
            const items = group.items.filter((i) => can(user, i.permission));
            if (items.length === 0) return null;
            return (
              <div key={group.title} className="sidebar__group">
                <p className="sidebar__group-title">{group.title}</p>
                <ul>
                  {items.map((item) => {
                    const active = current === item.href;
                    return (
                      <li key={item.href}>
                        <Link href={item.href} className={`sidebar__link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined} onClick={onClose}>
                          <Icon name={item.icon} size={17} />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
        <a className="sidebar__store" href={process.env.NEXT_PUBLIC_STORE_URL || 'http://localhost:5173'} target="_blank" rel="noreferrer">
          <Icon name="external" size={15} /> View website
        </a>
      </aside>
      {open && <div className="sidebar__scrim" onClick={onClose} aria-hidden="true" />}
    </>
  );
}
