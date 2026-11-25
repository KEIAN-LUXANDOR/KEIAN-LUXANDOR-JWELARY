import type { Metadata } from 'next';
import InfoContent from '@/components/common/InfoContent';

export const metadata: Metadata = { title: 'Privacy Policy' };

// Address: /privacy-policy
export default function Page() {
  return <InfoContent topic="privacy-policy" />;
}
