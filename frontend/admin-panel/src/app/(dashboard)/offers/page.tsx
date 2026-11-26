import type { Metadata } from 'next';
import OfferManager from '@/features/offers/components/OfferManager';

export const metadata: Metadata = { title: 'Offers' };

// Address: /offers
export default function Page() {
  return <OfferManager />;
}
