'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NAV_MENUS, UTILITY_LINKS } from '@/lib/data/navigation';
import { useUI } from '@/lib/providers/UIProvider';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';
import useEscapeKey from '@/hooks/useEscapeKey';
import Icon from '@/components/common/Icon';
import Logo from '@/components/common/Logo';
import { MenuLink } from './MegaMenu';
import './MobileMenu.css';

// Off-canvas drawer: level 1 = top menus, level 2 = accordion of columns.
export default function MobileMenu() {
  const { overlay, open, close } = useUI();
  const { customer } = useAuth();
  const isOpen = overlay === 'menu';
  const [menuId, setMenuId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useLockBodyScroll(isOpen);
  useEscapeKey(close, isOpen);

  const menu = NAV_MENUS.find((m) => m.id === menuId);
  const handleClose = () => {
    close();
    setMenuId(null);
    setExpanded(null);
  };

  return (
    <div className={`drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
      <div className="drawer__scrim" onClick={handleClose} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="drawer__head">
          {menu ? (
            <button className="drawer__back" onClick={() => { setMenuId(null); setExpanded(null); }}>
              <Icon name="chevronLeft" size={18} /> Back
            </button>
          ) : (
            <Logo />
          )}
          <button className="header__icon-btn" onClick={handleClose} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>

        <div className="drawer__body">
          {!menu && (
            <>
              <ul className="drawer__list">
                {NAV_MENUS.map((m) => (
                  <li key={m.id}>
                    <button className="drawer__item" onClick={() => setMenuId(m.id)}>
                      {m.label}
                      <Icon name="chevronRight" size={18} />
                    </button>
                  </li>
                ))}
              </ul>
              <ul className="drawer__utility">
                {UTILITY_LINKS.map((u) => (
                  <li key={u.to}>
                    <Link href={u.to} onClick={handleClose}>
                      <Icon name={u.icon} size={18} /> {u.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button onClick={() => open('appointment')}>
                    <Icon name="calendar" size={18} /> Book an Appointment
                  </button>
                </li>
                <li>
                  <Link href={customer ? '/profile' : '/login'} onClick={handleClose}>
                    <Icon name="user" size={18} /> {customer ? 'My Account' : 'Sign In'}
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" onClick={handleClose}>
                    <Icon name="heart" size={18} /> Wishlist
                  </Link>
                </li>
              </ul>
            </>
          )}

          {menu && (
            <div className="drawer__sub">
              <Link href={menu.to} className="drawer__sub-title serif" onClick={handleClose}>
                {menu.label}
              </Link>
              {menu.columns.map((col) => {
                const isExp = expanded === col.title;
                return (
                  <div key={col.title} className={`drawer__acc ${isExp ? 'is-open' : ''}`}>
                    <button className="drawer__acc-btn" aria-expanded={isExp} onClick={() => setExpanded(isExp ? null : col.title)}>
                      <span className="eyebrow">{col.title}</span>
                      <Icon name={isExp ? 'minus' : 'plus'} size={16} />
                    </button>
                    {isExp && (
                      <ul className="drawer__acc-list">
                        {col.links.map((link) => (
                          <li key={link.label + link.to}>
                            <MenuLink link={{ ...link, thumb: false }} onNavigate={handleClose} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
              {menu.explore && (
                <Link href={menu.explore.to} className="btn btn--block drawer__explore" onClick={handleClose}>
                  {menu.explore.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}