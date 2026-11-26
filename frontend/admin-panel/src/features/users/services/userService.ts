// Admin users. Backend: GET/POST /api/admin/users, PUT/DELETE /api/admin/users/{id}
import { createResource } from '@/services/createResource';
import type { AdminUser } from '@/types/models';

export const userService = createResource<AdminUser>('users', '/admin/users', 'usr');
