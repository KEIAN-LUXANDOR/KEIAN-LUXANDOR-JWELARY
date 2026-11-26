// Discount offers. Backend: GET/POST /api/admin/offers, PUT/DELETE /api/admin/offers/{id}
import { createResource } from '@/services/createResource';
import type { Offer } from '@/types/models';

export const offerService = createResource<Offer>('offers', '/admin/offers', 'off');
