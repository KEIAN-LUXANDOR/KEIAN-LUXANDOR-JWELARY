import { METALS, metalLabel } from '@/lib/constants';
import type { Coupon, DiscountType, Offer } from '@/types/models';
import { formatCurrency } from '@/utils/format';

export type ScheduleStatus = 'Live' | 'Scheduled' | 'Ended' | 'Inactive';

export const offerStatus = (o: Offer, now = new Date()): ScheduleStatus => {
  if (!o.active) return 'Inactive';
  if (new Date(o.startsAt) > now) return 'Scheduled';
  if (new Date(o.endsAt) < now) return 'Ended';
  return 'Live';
};

export const discountLabel = (type: DiscountType, value: number) => (type === 'percent' ? `${value}% off` : `${formatCurrency(value)} off`);

export const offerTarget = (o: Offer, categoryName: (slug: string) => string) =>
  o.appliesTo === 'all' ? 'Everything' : o.appliesTo === 'metal' ? metalLabel(o.target) : categoryName(o.target);

export type CouponStatus = 'Live' | 'Ended' | 'Used up' | 'Inactive';

export const couponStatus = (c: Coupon, now = new Date()): CouponStatus => {
  if (!c.active) return 'Inactive';
  if (c.expiresAt && new Date(c.expiresAt) < now) return 'Ended';
  if (c.usageLimit != null && c.usedCount >= c.usageLimit) return 'Used up';
  return 'Live';
};

export const METAL_OPTIONS = METALS.map((m) => ({ value: m.value, label: m.label }));
