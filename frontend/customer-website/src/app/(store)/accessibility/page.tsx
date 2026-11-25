import type { Metadata } from 'next';
import InfoContent from '@/components/common/InfoContent';

export const metadata: Metadata = { title: 'Accessibility' };

// Address: /accessibility
export default function Page() {
  return <InfoContent topic="accessibility" />;
}
