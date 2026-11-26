// Categories. Backend: GET/POST /api/admin/categories, PUT/DELETE /api/admin/categories/{id}
import { createResource } from '@/services/createResource';
import type { Category } from '@/types/models';

export const categoryService = createResource<Category>('categories', '/admin/categories', 'cat');
