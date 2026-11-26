import type { Metadata } from 'next';
import SpecificationManager from '@/features/specifications/components/SpecificationManager';

export const metadata: Metadata = { title: 'Specifications' };

// Address: /specifications
export default function Page() {
  return <SpecificationManager />;
}
