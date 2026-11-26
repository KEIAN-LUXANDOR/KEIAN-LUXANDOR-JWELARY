import { describe, expect, it } from 'vitest';
import { couponStatus, discountLabel, offerStatus } from '@/features/offers/utils/offerUtils';
import { normalizeCode, validateCoupon, type CouponInput } from '@/features/coupons/utils/couponUtils';
import type { Offer } from '@/types/models';

const now = new Date('2026-11-25T12:00:00Z');

describe('offers', () => {
  const offer: Offer = { id: 'o', name: 'x', description: '', discountType: 'percent', value: 10, appliesTo: 'all', target: '', startsAt: '2026-11-20T00:00:00Z', endsAt: '2026-11-30T00:00:00Z', active: true };

  it('works out Live / Scheduled / Ended / Inactive', () => {
    expect(offerStatus(offer, now)).toBe('Live');
    expect(offerStatus({ ...offer, startsAt: '2026-12-01T00:00:00Z', endsAt: '2026-12-10T00:00:00Z' }, now)).toBe('Scheduled');
    expect(offerStatus({ ...offer, endsAt: '2026-11-24T00:00:00Z' }, now)).toBe('Ended');
    expect(offerStatus({ ...offer, active: false }, now)).toBe('Inactive');
  });

  it('describes the discount', () => {
    expect(discountLabel('percent', 15)).toBe('15% off');
    expect(discountLabel('fixed', 50)).toBe('$50 off');
  });
});

describe('coupons', () => {
  const coupon: CouponInput = { code: 'GIFT50', description: '', discountType: 'fixed', value: 50, minOrder: 500, usageLimit: 10, usedCount: 2, expiresAt: '2026-12-31T00:00:00Z', active: true };

  it('cleans up the code people type', () => {
    expect(normalizeCode(' gift 50 ')).toBe('GIFT50');
  });

  it('rejects short, duplicate or too-generous coupons', () => {
    expect(validateCoupon({ ...coupon, code: 'AB' }, []).code).toBeDefined();
    expect(validateCoupon(coupon, ['GIFT50']).code).toMatch(/already exists/);
    expect(validateCoupon({ ...coupon, discountType: 'percent', value: 95 }, []).value).toBeDefined();
    expect(validateCoupon(coupon, [])).toEqual({});
  });

  it('is "Used up" when the usage limit is reached and "Ended" after expiry', () => {
    expect(couponStatus({ id: 'c', ...coupon }, now)).toBe('Live');
    expect(couponStatus({ id: 'c', ...coupon, usedCount: 10 }, now)).toBe('Used up');
    expect(couponStatus({ id: 'c', ...coupon, expiresAt: '2026-11-01T00:00:00Z' }, now)).toBe('Ended');
  });
});
