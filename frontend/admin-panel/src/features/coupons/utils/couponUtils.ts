import type { Coupon } from '@/types/models';
import type { FormErrors } from '@/utils/validation';

export type CouponInput = Omit<Coupon, 'id'>;

/** " welcome 10 " → "WELCOME10" */
export const normalizeCode = (code: string) => code.trim().toUpperCase().replace(/\s+/g, '');

export const validateCoupon = (v: CouponInput, takenCodes: string[]): FormErrors<CouponInput> => {
  const e: FormErrors<CouponInput> = {};
  const code = normalizeCode(v.code);
  if (!/^[A-Z0-9_-]{3,20}$/.test(code)) e.code = '3–20 letters or numbers, no spaces';
  else if (takenCodes.includes(code)) e.code = 'This code already exists';
  if (!(v.value > 0)) e.value = 'Must be more than 0';
  else if (v.discountType === 'percent' && v.value > 90) e.value = 'A percentage coupon can be at most 90%';
  if (v.minOrder < 0) e.minOrder = 'Can’t be negative';
  if (v.usageLimit != null && v.usageLimit < 1) e.usageLimit = 'At least 1, or leave empty for no limit';
  return e;
};

