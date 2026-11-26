// Customer reviews. Backend: GET/POST /api/admin/reviews, PUT/DELETE /api/admin/reviews/{id}
import { createResource } from '@/services/createResource';
import type { Review } from '@/types/models';

export const reviewService = createResource<Review>('reviews', '/admin/reviews', 'rev');
