// Products. Backend: GET/POST /api/admin/products, GET/PUT/DELETE /api/admin/products/{id}
import { createResource } from '@/services/createResource';
import type { Product } from '@/types/models';

export const productService = createResource<Product>('products', '/admin/products', 'prd');
