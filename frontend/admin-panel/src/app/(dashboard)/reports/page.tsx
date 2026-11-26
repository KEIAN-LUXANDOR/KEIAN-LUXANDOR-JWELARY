import type { Metadata } from 'next';
import Reports from '@/features/reports/components/Reports';

export const metadata: Metadata = { title: 'Reports' };

// Address: /reports
export default function Page() {
  return <Reports />;
}
