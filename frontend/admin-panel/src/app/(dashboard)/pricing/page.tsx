import type { Metadata } from 'next';
import PricingManager from '@/features/pricing/components/PricingManager';

export const metadata: Metadata = { title: 'Pricing' };

// Address: /pricing
export default function Page() {
  return <PricingManager />;
}
