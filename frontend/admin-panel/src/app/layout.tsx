import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import AppProviders from '@/lib/providers/AppProviders';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Keian Luxandor Admin', template: '%s | Keian Luxandor Admin' },
  description: 'Keian Luxandor store administration.',
  icons: { icon: '/icons/favicon.png' },
  robots: { index: false, follow: false }, // keep the admin panel out of Google
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
