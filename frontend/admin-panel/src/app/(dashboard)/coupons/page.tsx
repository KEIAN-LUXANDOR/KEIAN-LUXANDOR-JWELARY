import type { Metadata } from 'next';
import CouponManager from '@/features/coupons/components/CouponManager';

export const metadata: Metadata = { title: 'Coupons' };

// Address: /coupons
export default function Page() {
  return <CouponManager />;
}
