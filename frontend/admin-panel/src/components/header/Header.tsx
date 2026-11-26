'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/common/Icon';
import IconButton from '@/components/buttons/IconButton';
import type { AdminUser } from '@/types/models';

interface HeaderProps {
  user: AdminUser;
  onMenu: () => void;
  onLogout: () => Promise<void>;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

/** Top bar: menu button (mobile), signed-in admin and sign out. */
export default function Header({ user, onMenu, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setMenuOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  return (
    <header className="topbar">
      <IconButton icon="menu" label="Open menu" className="topbar__menu" onClick={onMenu} />
      <div className="topbar__spacer" />
      <div className="user-menu" ref={ref}>
        <button type="button" className="user-menu__btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-haspopup="menu">
          <span className="avatar" aria-hidden="true">
            {initials(user.name)}
          </span>
          <span className="user-menu__name">
            {user.name}
            <span className="user-menu__role">{user.role}</span>
          </span>
          <Icon name="chevronDown" size={14} />
        </button>
        {menuOpen && (
          <div className="user-menu__panel" role="menu">
            <p className="user-menu__email">{user.email}</p>
            <button
              type="button"
              role="menuitem"
              onClick={async () => {
                await onLogout();
                router.replace('/login');
              }}
            >
              <Icon name="logout" size={16} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
