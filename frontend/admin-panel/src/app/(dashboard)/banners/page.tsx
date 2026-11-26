import type { Metadata } from 'next';
import BannerManager from '@/features/banners/components/BannerManager';

export const metadata: Metadata = { title: 'Banners' };

// Address: /banners
export default function Page() {
  return <BannerManager />;
}
