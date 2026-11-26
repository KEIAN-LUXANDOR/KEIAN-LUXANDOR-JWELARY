import type { Metadata } from 'next';
import ReviewManager from '@/features/reviews/components/ReviewManager';

export const metadata: Metadata = { title: 'Reviews' };

// Address: /reviews
export default function Page() {
  return <ReviewManager />;
}
