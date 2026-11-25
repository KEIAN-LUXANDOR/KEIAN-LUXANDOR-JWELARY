import type { Metadata } from 'next';
import InfoContent from '@/components/common/InfoContent';

export const metadata: Metadata = { title: 'Shop with Confidence' };

// Address: /shop-with-confidence
export default function Page() {
  return <InfoContent topic="shop-with-confidence" />;
}
