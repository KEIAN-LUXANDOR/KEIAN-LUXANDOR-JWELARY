'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import MobileMenu from '@/components/navigation/MobileMenu';
import SearchOverlay from '@/features/search/components/SearchOverlay';
import { useUI } from '@/lib/providers/UIProvider';
import AppointmentModal from './AppointmentModal';
import ChatWidget from './ChatWidget';

// App shell: shared header, footer and overlays around every page.
export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { toast, close } = useUI();

  // Scroll to top (or to #hash) and close overlays when the page changes.
  useEffect(() => {
    close();
    const hash = window.location.hash;
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, close]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />

      {/* Global overlays */}
      <MobileMenu />
      <SearchOverlay />
      <AppointmentModal />
      <ChatWidget />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
