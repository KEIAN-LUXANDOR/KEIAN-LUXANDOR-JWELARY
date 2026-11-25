import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { preload } from 'react-dom';
import AppProviders from '@/lib/providers/AppProviders';
import SiteShell from '@/components/common/SiteShell';
import './globals.css';
import '@/components/common/content.css';

export const metadata: Metadata = {
  title: {
    default: 'Keian Luxandor | Fine Jewelry, Engagement & Wedding Rings',
    template: '%s | Keian Luxandor',
  },
  description: 'Keian Luxandor fine jewelry — engagement rings, wedding bands, everyday diamonds and gifts, finished by hand.',
  icons: { icon: { url: '/icons/keian-logo.png', type: 'image/png' } },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// The outer frame of every page: fonts, shared state, header and footer.
export default function RootLayout({ children }: { children: ReactNode }) {
  // (The home banner photo is loaded first automatically, because the
  // banner <img> in Hero has fetchPriority="high".)
  // Main fonts load early (they are stored in public/fonts).
  preload('/fonts/jost-latin-300-normal.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  preload('/fonts/jost-latin-400-normal.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  preload('/fonts/ibarra-real-nova-latin-400-normal.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}
