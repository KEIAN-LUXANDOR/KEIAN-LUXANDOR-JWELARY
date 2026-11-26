// Coupon codes. Backend: GET/POST /api/admin/coupons, PUT/DELETE /api/admin/coupons/{id}
import { createResource } from '@/services/createResource';
import type { Coupon } from '@/types/models';

export const couponService = createResource<Coupon>('coupons', '/admin/coupons', 'cpn');
