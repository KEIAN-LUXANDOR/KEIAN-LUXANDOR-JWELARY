// Homepage banners. Backend: GET/POST /api/admin/banners, PUT/DELETE /api/admin/banners/{id}
import { createResource } from '@/services/createResource';
import type { Banner } from '@/types/models';

export const bannerService = createResource<Banner>('banners', '/admin/banners', 'ban');
